"""Write the exact prompt each condition sees, one file per case.

    python tools/conditions/build_prompts.py runs/2026-11-26-claude-opus --suite extended

Writes <out>/{A,B,C}/<case_id>/prompt.md:
  A  task only, no design-system context
  B  task + examples/demo-design-system/DESIGN.md
  C  task + examples/demo-design-system/ds.artifact.json

Case titles, required_components and forbidden_patterns are grader metadata and
are left out of every condition.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from ds_eval import repo_root
from ds_eval.loader import load_cases, select_cases

TEMPLATE = """You are writing UI code for an existing React 18 + TypeScript app (Vite).
{context}
## Task

{task}
## Output

Return exactly one file: `src/task/Task.tsx`. It must export a React function component named `Task`, which the app renders as the page root. Return only the file contents, with no explanation.
"""


def contexts(system_dir: Path) -> dict[str, str]:
    design_md = (system_dir / "DESIGN.md").read_text(encoding="utf-8").strip()
    artifact = (system_dir / "ds.artifact.json").read_text(encoding="utf-8").strip()
    return {
        "A": "",
        "B": (
            "\nThis project has a design system. Build the UI with it. Its DESIGN.md follows.\n\n"
            f"<design_md>\n{design_md}\n</design_md>\n"
        ),
        "C": (
            "\nThis project has a design system. Build the UI with it. Its machine-readable design-system "
            "artifact (component API, tokens, anti-patterns) follows.\n\n"
            f"```json\n{artifact}\n```\n"
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("out", type=Path)
    parser.add_argument("--suite", default="extended")
    parser.add_argument("--system", type=Path, default=repo_root() / "examples" / "demo-design-system")
    args = parser.parse_args()

    cases = select_cases(load_cases(), suite=args.suite)
    for condition, context in contexts(args.system).items():
        for case in cases:
            path = args.out / condition / case.id / "prompt.md"
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(TEMPLATE.format(context=context, task=case.prompt), encoding="utf-8")
    print(f"wrote {len(cases)} cases x 3 conditions under {args.out}")


if __name__ == "__main__":
    main()
