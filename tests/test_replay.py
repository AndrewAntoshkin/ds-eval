from ds_eval.adapters import build_adapter
from ds_eval.adapters.base import EvalContext
from ds_eval.schemas import EvalCase, ModelConfig


def _case() -> EvalCase:
    return EvalCase(id="component-button-001", title="t", category="component", difficulty="easy", prompt="p")


def test_replay_reads_answer_and_prompt(tmp_path):
    case_dir = tmp_path / "component-button-001"
    case_dir.mkdir()
    (case_dir / "Task.tsx").write_text("export function Task() { return null; }", encoding="utf-8")
    (case_dir / "prompt.md").write_text("the exact prompt", encoding="utf-8")
    adapter = build_adapter(ModelConfig(provider="replay", model="m", path=str(tmp_path)))
    result = adapter.generate("ignored", EvalContext(case=_case(), ds_docs="", system_prompt=""))
    assert result.error is None
    assert result.files == {"src/task/Task.tsx": "export function Task() { return null; }"}
    assert result.task_prompt == "the exact prompt"
    assert result.provider == "replay"


def test_replay_missing_answer_is_an_error(tmp_path):
    adapter = build_adapter(ModelConfig(provider="replay", path=str(tmp_path)))
    result = adapter.generate("ignored", EvalContext(case=_case(), ds_docs="", system_prompt=""))
    assert result.files == {}
    assert "Missing answer" in (result.error or "")
