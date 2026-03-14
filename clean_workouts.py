import json

# Predefined essential exercises
essential = [
    "벤치프레스", "인클라인 벤치프레스", "덤벨 벤치프레스", "데드리프트", "루마니안 데드리프트", 
    "컨벤셔널 데드리프트", "스쿼트", "백 스쿼트", "레그 프레스", "레그 익스텐션", "레그 컬",
    "밀리터리 프레스", "덤벨 숄더 프레스", "사이드 레터럴 레이즈", "바벨 로우", "원암 덤벨 로우",
    "렛풀다운", "풀업", "친업", "시티드 로우", "딥스", "푸쉬업", "바벨 컬", "덤벨 컬",
    "트라이셉스 푸쉬다운", "라잉 트라이셉스 익스텐션", "플랭크", "크런치", "레그 레이즈"
]

# Load existing ones
try:
    with open('apps/web/data/workouts.json', 'r', encoding='utf-8') as f:
        existing = json.load(f)
except:
    existing = []

# Filter existing junk
def is_valid(w):
    junk = ['#', '(', '0', '1', '5', 'False', 'MAX', 'lb', 'ⓒ', '날짜', '간식', '단백질', '탄수화물', '지방', '수분', '숙면', '컨디션', '피드백', '한줄평', '!', '?', '이동주', '아\n침', '점\n심', '저\n녁']
    if len(w) < 2: return False
    if any(j in w for j in junk): return False
    if w.endswith(' RM'): return False
    return True

filtered_existing = [w for w in existing if is_valid(w)]

# Combine and unique
all_workouts = sorted(list(set(essential + filtered_existing)))

with open('apps/web/data/workouts.json', 'w', encoding='utf-8') as f:
    json.dump(all_workouts, f, ensure_ascii=False, indent=2)

print(f"Updated workouts.json with {len(all_workouts)} items.")
