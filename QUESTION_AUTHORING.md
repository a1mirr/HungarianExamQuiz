# Question Authoring Guide

## Overview

This guide explains how to add new questions to the Hungarian quiz with proper `inputType` categorization and validation.

## Input Type Categories

### 1. `number` - Exact Integer
**Used for:** Counts, quantities that must be exact  
**Example:** "Hány nemzeti ünnepe van Magyarországnak?" → `"answer": "3"`

### 2. `year` - Single Year  
**Used for:** Birth years, death years  
**Example:** "Mikor született Petőfi Sándor?" → `"answer": "1823"`

### 3. `date` - Full Date  
**Used for:** Specific events with exact dates  
**Example:** "Mikor volt az 1848-as forradalom?" → `"answer": "1848.03.15"`

### 4. `year-interval` - Multi-Year Period  
**Used for:** Reigns, wars, longer periods  
**Example:** "Mikor uralkodott Mátyás király?" → `"answer": "1458-1490"`

### 5. `date-interval` - Short Period  
**Used for:** Brief events spanning days/weeks  
**Example:** "Mikor tartott a tatárjárás?" → `"answer": "1241-1242"`

### 6. `approximate` - Numbers with Tolerance  
**Used for:** Population, area, casualties  
**Format:**
```json
{
  "inputType": "approximate",
  "answer": "9600000",
  "tolerance": 0.1,
  "unit": "fő"
}
```

### 7. `person` - Person Names  
**Used for:** Questions asking for names  
**Example:** "Ki írta a Himnuszt?" → `"answer": "Kölcsey Ferenc"`

### 8. `text` - Free Text  
**Used for:** Descriptive answers, concepts  
**Example:** "Mi a nemzeti virág?" → `"answer": "Tulipán"`

## Answer Formatting Rules

**DO** ✅
- Use numeric values only for number/date/year
- Remove ALL text alternatives (no "7 ÷ Hét")
- Standard date format: YYYY.MM.DD
- Plain numbers: 9600000, not "9.6 millió"

**DON'T** ❌
- Mix text and numbers for numeric types
- Include units in answer (use `unit` field)
- Use approximate language in answer

## Decision Tree

- "Hány...?" → `number` (exact) or `approximate` (population)
- "Mikor...?" → `date` / `year` / `year-interval`
- "Ki...?" → `person`
- "Mi...?" / "Milyen...?" → `text` or `number`
