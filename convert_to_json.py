"""Simple converter to create JSON files from TSV data"""
import json
import os

# Base paths
base = r"c:\Hungarian exam\output"
out_dir = r"c:\Hungarian exam\docs\data"

# Create output directory
os.makedirs(out_dir, exist_ok=True)

# Topic definitions
topics = {
    "01_national_symbols": {"en": "National Symbols & Holidays", "ru": "Символы и праздники", "hu": "Nemzeti szimbólumok"},
    "02a_history_ancient": {"en": "History: Ancient Times", "ru": "История: Древность", "hu": "Történelem: Őskori"},
    "02b_history_ottoman": {"en": "History: Ottoman Period", "ru": "История: Османы", "hu": "Történelem: Oszmán"},
    "02c_history_modern": {"en": "History: Modern Era", "ru": "История: Новое время", "hu": "Történelem: Újkor"},
    "02d_history_contemporary": {"en": "History: 20th Century", "ru": "История: XX век", "hu": "Történelem: 20. század"},
    "03a_literature": {"en": "Literature", "ru": "Литература", "hu": "Irodalom"},
    "03b_music_art": {"en": "Music & Art", "ru": "Музыка и искусство", "hu": "Zene és művészet"},
    "04_constitution": {"en": "Constitution", "ru": "Конституция", "hu": "Alkotmány"},
    "05_rights": {"en": "Rights", "ru": "Права", "hu": "Jogok"},
    "06_geography": {"en": "Geography", "ru": "География", "hu": "Földrajz"},
    "07_budapest": {"en": "Budapest", "ru": "Будапешт", "hu": "Budapest"},
    "08_hungarikums": {"en": "Hungarikums", "ru": "Хунгарикумы", "hu": "Hungarikumok"},
    "09_christianity": {"en": "Christianity", "ru": "Христианство", "hu": "Kereszténység"},
    "10_european_union": {"en": "European Union", "ru": "Европейский Союз", "hu": "Európai Unió"}
}

all_topics = []

for topic_id, names in topics.items():
    en_file = os.path.join(base, "en_topics", f"{topic_id}.tsv")
    ru_file = os.path.join(base, "ru_topics", f"{topic_id}.txt")
    
    questions = []
    
    # Read EN file
    with open(en_file, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f.readlines()[1:] if l.strip()]
        for line in lines:
            parts = line.split('\t')
            if len(parts) >= 4:
                questions.append({
                    "word_hu": parts[0],
                    "example_hu": parts[1],
                    "word_en": parts[2],
                    "example_en": parts[3],
                    "word_ru": "",
                    "example_ru": ""
                })
    
    # Read RU file and merge
    with open(ru_file, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f.readlines()[1:] if l.strip()]
        for i, line in enumerate(lines):
            if i < len(questions):
                parts = line.split('\t')
                if len(parts) >= 4:
                    questions[i]["word_ru"] = parts[2]
                    questions[i]["example_ru"] = parts[3]
    
    # Save topic JSON
    topic_data = {
        "id": topic_id,
        "name": names,
        "questions": questions,
        "count": len(questions)
    }
    
    with open(os.path.join(out_dir, f"{topic_id}.json"), 'w', encoding='utf-8') as f:
        json.dump(topic_data, f, ensure_ascii=False, indent=2)
    
    all_topics.append({"id": topic_id, "name": names, "count": len(questions)})
    print(f"✓ {topic_id}: {len(questions)} questions")

# Save index
with open(os.path.join(out_dir, "topics.json"), 'w', encoding='utf-8') as f:
    json.dump(all_topics, f, ensure_ascii=False, indent=2)

print(f"\n✓ Created {len(all_topics)} topic files + index")
