import json
import os
import re

first_session_transcript = r"C:\Users\Jitendra\.gemini\antigravity-ide\brain\f9c29abb-d25f-4547-bdbd-06a0f84b42f1\.system_generated\logs\transcript_full.jsonl"
second_session_transcript = r"C:\Users\Jitendra\.gemini\antigravity-ide\brain\e402acae-44e1-4d2d-9838-e78d6085bb94\.system_generated\logs\transcript_full.jsonl"

def inspect_transcripts():
    print("--- First Session Transcript Tool Calls ---")
    with open(first_session_transcript, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
            except Exception:
                continue
            step_idx = data.get("step_index")
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                name = tc.get("name")
                args = tc.get("args", {})
                if name in ["write_to_file", "replace_file_content", "multi_replace_file_content"]:
                    path = args.get("TargetFile", "unknown")
                    print(f"Step {step_idx}: {name} -> {path}")

inspect_transcripts()
