"""Summarise ds-eval results for the A/B/C conditions into markdown tables + JSON.

    python tools/conditions/aggregate.py runs/2026-11-26-claude-opus

Reads <run>/scored/claude-opus-{A,B,C}/summary.json (written by `ds-eval run`) and
<run>/{A,B,C}/<case_id>/Task.tsx. All ds-eval numbers are copied from summary.json;
nothing is rescored. These supplementary columns are computed here and are NOT
part of the ds-eval score:
  - ds_imports: distinct names imported from '@ds' (Babel AST, same parser ds-eval uses)
  - raw_px: occurrences of raw px literals in the source (regex \\b\\d+(?:\\.\\d+)?px\\b)
  - tsc_errors: `tsc --noEmit` errors when the answer is type-checked against the demo DS
Writes <run>/tables.md and <run>/metrics.json.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from ds_eval import repo_root
from ds_eval.ast_parse import parse_tsx
from ds_eval.loader import load_suites

CONDITIONS = {
    "A": "A: no DS context",
    "B": "B: DESIGN.md",
    "C": "C: DS artifact (JSON)",
}
PX = re.compile(r"\b\d+(?:\.\d+)?px\b")
TSC_ERROR = re.compile(r"error TS\d+")


def tsc_errors(source: str, system_dir: Path) -> int:
    with tempfile.TemporaryDirectory() as tmp:
        sandbox = Path(tmp) / "app"
        shutil.copytree(system_dir, sandbox, ignore=shutil.ignore_patterns("node_modules", "dist"))
        os.symlink(system_dir / "node_modules", sandbox / "node_modules", target_is_directory=True)
        (sandbox / "src" / "task" / "Task.tsx").write_text(source, encoding="utf-8")
        proc = subprocess.run(
            [str(sandbox / "node_modules" / ".bin" / "tsc"), "--noEmit", "-p", "."],
            cwd=sandbox,
            capture_output=True,
            text=True,
        )
        return len(TSC_ERROR.findall(proc.stdout + proc.stderr))


def case_metrics(case: dict, source: str, system_dir: Path) -> dict:
    graders = {g["name"]: g for g in case["graders"]}
    static = graders["static"]["details"]
    compliance = graders["ds_compliance"]["details"]
    axe = graders["accessibility"]["details"]
    parsed = parse_tsx(source)
    ds_imports = sorted({n for item in parsed["imports"] if item["source"] == "@ds" for n in item["names"]})
    required = compliance.get("required") or []
    found = compliance.get("found") or []
    return {
        "id": case["id"],
        "required_found": len(found),
        "required_total": len(required),
        "component_reuse_pct": round(100 * len(found) / len(required), 1) if required else None,
        "hex_count": len(static.get("hex") or []),
        "native_elements": static.get("native_elements") or [],
        "forbidden_hits": compliance.get("forbidden_hits") or [],
        "axe_violations": axe.get("violation_count"),
        "axe_violation_ids": [v["id"] for v in axe.get("violations") or []],
        "ds_score": case["scores"]["ds_compliance"],
        "functional": case["scores"]["functional"],
        "accessibility": case["scores"]["accessibility"],
        "code_quality": case["scores"]["code_quality"],
        "reliability": case["scores"]["reliability"],
        "overall": case["scores"]["overall"],
        "build": graders["reliability"]["details"].get("build"),
        "page_errors": len(graders["reliability"]["details"].get("page_errors") or []),
        "ds_imports": len(ds_imports),
        "ds_import_names": ds_imports,
        "raw_px": len(PX.findall(source)),
        "tsc_errors": tsc_errors(source, system_dir),
    }


MEAN_KEYS = [
    "component_reuse_pct",
    "hex_count",
    "axe_violations",
    "ds_score",
    "functional",
    "accessibility",
    "overall",
    "ds_imports",
    "raw_px",
    "tsc_errors",
]


def means(rows: list[dict]) -> dict:
    out = {}
    for key in MEAN_KEYS:
        values = [r[key] for r in rows if r[key] is not None]
        # sum/len, not statistics.mean, so float rounding matches ds-eval's summary.json
        out[key] = round(sum(values) / len(values), 1) if values else None
    out["n"] = len(rows)
    out["tasks_with_any_hex"] = sum(1 for r in rows if r["hex_count"] > 0)
    out["tasks_with_native_controls"] = sum(1 for r in rows if r["native_elements"])
    out["tasks_all_required_found"] = sum(1 for r in rows if r["required_found"] == r["required_total"])
    out["tasks_tsc_clean"] = sum(1 for r in rows if r["tsc_errors"] == 0)
    out["runtime_crashes"] = sum(1 for r in rows if r["page_errors"])
    return out


def fmt(value) -> str:
    return "–" if value is None else f"{value:g}" if isinstance(value, (int, float)) else str(value)


def render(metrics: dict, smoke_ids: list[str]) -> str:
    lines: list[str] = []
    for label, subset in (("All 14 tasks (`extended` suite)", None), ("Original 10 tasks only (`smoke` suite)", smoke_ids)):
        key = "means_smoke" if subset else "means_all"
        lines += [f"### ds-eval means: {label}", ""]
        lines.append(
            "| Condition | n | Component reuse % | Hardcoded hex colors (mean / tasks with any) "
            "| axe violations (mean) | A11y score | DS score | Functional | Overall |"
        )
        lines.append("| --- | --- | --- | --- | --- | --- | --- | --- | --- |")
        for cond, label_c in CONDITIONS.items():
            m = metrics[cond][key]
            lines.append(
                f"| {label_c} | {m['n']} | {fmt(m['component_reuse_pct'])} | {fmt(m['hex_count'])} / {m['tasks_with_any_hex']} "
                f"| {fmt(m['axe_violations'])} | {fmt(m['accessibility'])} | {fmt(m['ds_score'])} | {fmt(m['functional'])} "
                f"| {fmt(m['overall'])} |"
            )
        lines += ["", f"Supplementary (not part of the ds-eval score), {label}:", ""]
        lines.append(
            "| Condition | Names imported from `@ds` (mean) | Tasks with native button/input/select/textarea "
            "| Raw px literals (mean) | `tsc` errors vs DS types (mean / tasks clean) | Runtime crashes |"
        )
        lines.append("| --- | --- | --- | --- | --- | --- |")
        for cond, label_c in CONDITIONS.items():
            m = metrics[cond][key]
            lines.append(
                f"| {label_c} | {fmt(m['ds_imports'])} | {m['tasks_with_native_controls']}/{m['n']} | {fmt(m['raw_px'])} "
                f"| {fmt(m['tsc_errors'])} / {m['tasks_tsc_clean']} of {m['n']} | {m['runtime_crashes']} |"
            )
        lines.append("")
    lines += ["### Per task", ""]
    lines.append(
        "Cell format: `reuse found/required · hex · axe · DS · functional · tsc`. "
        "reuse = required components found by ds-eval; hex = unique hardcoded hex colors; axe = axe-core violations; "
        "DS = ds-eval DS compliance score; functional = ds-eval Playwright score; tsc = supplementary type errors."
    )
    lines.append("")
    lines.append("| Task | " + " | ".join(CONDITIONS.values()) + " |")
    lines.append("| --- | --- | --- | --- |")
    ids = [r["id"] for r in metrics["A"]["cases"]]
    for case_id in ids:
        cells = []
        for cond in CONDITIONS:
            r = next(x for x in metrics[cond]["cases"] if x["id"] == case_id)
            cells.append(
                f"{r['required_found']}/{r['required_total']} · {r['hex_count']} · {r['axe_violations']} · "
                f"{fmt(r['ds_score'])} · {fmt(r['functional'])} · {r['tsc_errors']}"
            )
        lines.append(f"| {case_id} | " + " | ".join(cells) + " |")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("run", type=Path)
    parser.add_argument("--system", type=Path, default=repo_root() / "examples" / "demo-design-system")
    args = parser.parse_args()
    smoke_ids = load_suites()["smoke"]
    metrics: dict = {}
    for cond in CONDITIONS:
        summary = json.loads((args.run / "scored" / f"claude-opus-{cond}" / "summary.json").read_text(encoding="utf-8"))
        rows = []
        for case in sorted(summary["cases"], key=lambda c: c["id"]):
            source = (args.run / cond / case["id"] / "Task.tsx").read_text(encoding="utf-8")
            rows.append(case_metrics(case, source, args.system.resolve()))
        metrics[cond] = {
            "run_id": summary["run_id"],
            "ds_eval_overall": summary["overall"],
            "ds_eval_aggregates": summary["aggregates"],
            "means_all": means(rows),
            "means_smoke": means([r for r in rows if r["id"] in smoke_ids]),
            "cases": rows,
        }
    (args.run / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    (args.run / "tables.md").write_text(render(metrics, smoke_ids), encoding="utf-8")
    print((args.run / "tables.md").read_text(encoding="utf-8"))


if __name__ == "__main__":
    main()
