import json
import os
import re

first_session_transcript = r"C:\Users\Jitendra\.gemini\antigravity-ide\brain\f9c29abb-d25f-4547-bdbd-06a0f84b42f1\.system_generated\logs\transcript_full.jsonl"
second_session_transcript = r"C:\Users\Jitendra\.gemini\antigravity-ide\brain\e402acae-44e1-4d2d-9838-e78d6085bb94\.system_generated\logs\transcript_full.jsonl"
out_dir = r"C:\Users\Jitendra\OneDrive\Desktop\Startup\Startup\scratch\reconstructed_first_session"
os.makedirs(out_dir, exist_ok=True)

# Parse first session
first_steps = {}
with open(first_session_transcript, "r", encoding="utf-8") as f:
    for line in f:
        if not line.strip():
            continue
        try:
            data = json.loads(line)
        except Exception:
            continue
        step_idx = data.get("step_index")
        if step_idx is not None:
            first_steps[step_idx] = data

# Parse second session
second_steps = {}
with open(second_session_transcript, "r", encoding="utf-8") as f:
    for line in f:
        if not line.strip():
            continue
        try:
            data = json.loads(line)
        except Exception:
            continue
        step_idx = data.get("step_index")
        if step_idx is not None:
            second_steps[step_idx] = data

def extract_write_to_file_content(step_data):
    tool_calls = step_data.get("tool_calls", [])
    for tc in tool_calls:
        if tc.get("name") == "write_to_file":
            return tc.get("args", {}).get("CodeContent", "")
    return ""

def clean_view_file_output(content):
    lines = content.split('\n')
    cleaned_lines = []
    header_ended = False
    for line in lines:
        if not header_ended:
            if "The following code has been modified to include a line number" in line:
                header_ended = True
                continue
            if line.startswith("Showing lines") or line.startswith("File Path:") or line.startswith("Total Lines:") or line.startswith("Total Bytes:"):
                continue
            if line.startswith("Created At:") or line.startswith("Completed At:"):
                continue
            if "The above content shows the entire" in line:
                continue
        
        # If we are past headers, parse out the line numbers
        match = re.match(r'^\s*(\d+):\s(.*)$', line)
        if match:
            cleaned_lines.append(match.group(2))
        elif re.match(r'^\s*(\d+):$', line):
            cleaned_lines.append("")
        else:
            if "The above content shows the entire" in line:
                continue
            if header_ended:
                cleaned_lines.append(line)
            else:
                cleaned_lines.append(line)
                
    return '\n'.join(cleaned_lines)

# Reconstruct files from write_to_file calls
reconstructed = {}

# main.js (Step 32)
reconstructed["js/main.js"] = extract_write_to_file_content(first_steps[32])
# index.html (Step 38)
reconstructed["index.html"] = extract_write_to_file_content(first_steps[38])
# about.html (Step 40)
reconstructed["about.html"] = extract_write_to_file_content(first_steps[40])
# service.html (Step 42)
reconstructed["service.html"] = extract_write_to_file_content(first_steps[42])
# portfolio.html (Step 44)
reconstructed["portfolio.html"] = extract_write_to_file_content(first_steps[44])
# technologies.html (Step 46)
reconstructed["technologies.html"] = extract_write_to_file_content(first_steps[46])
# student-projects.html (Step 48)
reconstructed["student-projects.html"] = extract_write_to_file_content(first_steps[48])
# pricing.html (Step 50)
reconstructed["pricing.html"] = extract_write_to_file_content(first_steps[50])
# testimonials.html (Step 52)
reconstructed["testimonials.html"] = extract_write_to_file_content(first_steps[52])
# blog.html (Step 54)
reconstructed["blog.html"] = extract_write_to_file_content(first_steps[54])
# careers.html (Step 56)
reconstructed["careers.html"] = extract_write_to_file_content(first_steps[56])
# contact.html (Step 58)
reconstructed["contact.html"] = extract_write_to_file_content(first_steps[58])
# 404.html (Step 60)
reconstructed["404.html"] = extract_write_to_file_content(first_steps[60])

# Stitch css/style.css from steps 13, 17, 19 in second session
css_chunk_1 = clean_view_file_output(second_steps[13].get("content", ""))
css_chunk_2 = clean_view_file_output(second_steps[17].get("content", ""))
css_chunk_3 = clean_view_file_output(second_steps[19].get("content", ""))

# Stitch them together
css_content = css_chunk_1.strip() + "\n" + css_chunk_2.strip() + "\n" + css_chunk_3.strip()
reconstructed["css/style.css"] = css_content

# Save all reconstructed files
for rel_path, content in reconstructed.items():
    file_path = os.path.join(out_dir, rel_path)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as out_f:
        out_f.write(content)
    print(f"Reconstructed: {rel_path} (length: {len(content)})")
