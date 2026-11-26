from __future__ import annotations

from ds_eval import repo_root
from ds_eval.adapters.base import EvalContext, ModelAdapter
from ds_eval.schemas import GenerationResult


class ReplayAdapter(ModelAdapter):
    """Score answers generated outside the harness: <path>/<case_id>/Task.tsx (+ optional prompt.md)."""

    def generate(self, prompt: str, context: EvalContext) -> GenerationResult:
        model = self.config.model or "replay"
        if not self.config.path:
            return GenerationResult(files={}, model=model, provider="replay", error="replay model needs a path")
        case_dir = repo_root() / self.config.path / context.case.id
        task = case_dir / "Task.tsx"
        if not task.exists():
            return GenerationResult(files={}, model=model, provider="replay", error=f"Missing answer {task}")
        source = task.read_text(encoding="utf-8")
        prompt_file = case_dir / "prompt.md"
        return GenerationResult(
            files={"src/task/Task.tsx": source},
            raw_text=source,
            model=model,
            provider="replay",
            system_prompt="(none: the full prompt is in prompt.md)" if prompt_file.exists() else "",
            task_prompt=prompt_file.read_text(encoding="utf-8") if prompt_file.exists() else "",
        )
