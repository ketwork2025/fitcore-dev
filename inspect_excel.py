import pandas as pd

df = pd.read_excel('트레이너용_운동관리표.xlsx', sheet_name='Workout')
# Find all unique non-null strings
all_strings = pd.Series(df.values.flatten()).dropna().unique()
# Filter for strings that are likely exercise names
# Korean characters are usually used for exercise names in this doc
exercices = [s for s in all_strings if isinstance(s, str) and len(s) > 1 and not s.isdigit()]

print("\n".join(sorted(exercices)))
