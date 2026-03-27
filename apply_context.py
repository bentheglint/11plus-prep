import re

filepath = r"C:\Users\Ben Jackson\Projects\11plus-prep\src\App.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Define replacements: (old_question, new_question)
replacements = [
    # Q16: "someone drives" -> family trip context
    (
        'question: "What is the average speed if someone drives 180 km in 4 hours?"',
        'question: "A family drives 180 km to visit their grandparents. The journey takes 4 hours. What is their average speed?"'
    ),
    # Q18: abstract travel -> school trip context
    (
        'question: "How long does it take to travel 300 km at 75 km/h?"',
        'question: "A school minibus drives 300 km to a football tournament at 75 km/h. How long does the journey take?"'
    ),
    # Q21: abstract conversion -> animal context
    (
        'question: "Convert 90 km/h to meters per second."',
        'question: "A cheetah runs at 90 km/h. What is this speed in metres per second?"'
    ),
    # Q22: abstract travel -> ambulance context
    (
        'question: "How many minutes does it take to travel 25 km at 100 km/h?"',
        'question: "An ambulance races 25 km to the hospital at 100 km/h. How many minutes does the journey take?"'
    ),
    # Q24: "someone walks" -> postman context
    (
        'question: "Someone walks 2000 meters in 10 minutes. What is the speed in km/h?"',
        'question: "A postman walks 2000 metres delivering letters in 10 minutes. What is his speed in km/h?"'
    ),
    # Q26: abstract -> delivery van context
    (
        'question: "What is the speed if 210 km is covered in 3 hours?"',
        'question: "A delivery van covers 210 km in 3 hours. What is its speed?"'
    ),
    # Q28: abstract travel -> train context
    (
        'question: "How long does it take to travel 360 km at 90 km/h?"',
        'question: "A train travels 360 km from London to the Lake District at 90 km/h. How long does the journey take?"'
    ),
    # Q30: "an object" -> remote-controlled car context
    (
        'question: "An object moves at 12 m/s for 35 seconds. How far does it travel?"',
        'question: "A remote-controlled car moves at 12 m/s for 35 seconds. How far does it travel?"'
    ),
    # Q31: abstract conversion -> racing car context
    (
        'question: "Convert 108 km/h to meters per second."',
        'question: "A racing car zooms around a track at 108 km/h. What is this speed in metres per second?"'
    ),
    # Q60: "an object" -> dolphin context
    (
        'question: "An object moves at 11 m/s for 30 seconds. Distance?"',
        'question: "A dolphin swims at 11 m/s for 30 seconds. How far does it travel?"'
    ),
]

count = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        count += 1
        print(f"Replaced: {old[:60]}...")
    else:
        print(f"NOT FOUND: {old[:60]}...")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nDone! {count} replacements made.")
