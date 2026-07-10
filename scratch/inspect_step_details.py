import json

transcript_path = r"C:\Users\Jitendra\.gemini\antigravity-ide\brain\e402acae-44e1-4d2d-9838-e78d6085bb94\.system_generated\logs\transcript_full.jsonl"

steps_to_inspect = [10, 11, 26, 27, 34, 35]

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        if not line.strip():
            continue
        try:
            data = json.loads(line)
        except Exception as e:
            continue
        step_index = data.get("step_index")
        if step_index in steps_to_inspect:
            print(f"--- Step {step_index} ({data.get('type')}) ---")
            if "tool_calls" in data:
                print("Tool Calls:", json.dumps(data["tool_calls"], indent=2))
            if "content" in data:
                print("Content Length:", len(data["content"]))
                print("Content preview:", data["content"][:300].replace('\n', ' '))
