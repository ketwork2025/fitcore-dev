import pandas as pd
import json

try:
    # Read the Workout sheet
    df = pd.read_excel('트레이너용_운동관리표.xlsx', sheet_name='Workout')
    
    # Simple strategy: look for columns that might contain workout names
    # and filter out numbers/NaNs. 
    # Usually workout names are in specific columns.
    
    all_values = []
    for col in df.columns:
        all_values.extend(df[col].dropna().astype(str).tolist())
    
    # Filter out common non-workout strings found in the template
    # and keep strings that look like workout names.
    exclude = ['0', 'Unnamed', 'set', '무게', '횟수', '비고', '일자', '시간', '운동명', '부위', 'Workout', '식이조절', '활동강도']
    
    workouts = set()
    for v in all_values:
        v = v.strip()
        if len(v) > 1 and not any(ex in v for ex in exclude) and not v.replace('.','').isdigit():
            # Add heuristics for fitness terms if needed
            workouts.add(v)
            
    # Save to a JSON file for the web app to use
    with open('workout_list.json', 'w', encoding='utf-8') as f:
        json.dump(sorted(list(workouts)), f, ensure_ascii=False, indent=2)
        
    print(f"Successfully extracted {len(workouts)} workout items.")
    print("Samples:", list(workouts)[:10])

except Exception as e:
    print(f"Error: {e}")
