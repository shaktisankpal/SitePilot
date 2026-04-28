from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import warnings
import os
import sys

# Suppress all warnings
warnings.filterwarnings("ignore")
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HUGGINGFACE_HUB_TOKEN"] = ""
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# Suppress HuggingFace and transformers logging
import logging
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("transformers.modeling_utils").setLevel(logging.ERROR)
logging.getLogger("transformers.configuration_utils").setLevel(logging.ERROR)
logging.getLogger("transformers.modeling_utils").setLevel(logging.CRITICAL)

# Suppress Flask development server warning
import click
click.disable_unicode_literals_warning = True


app = Flask(__name__)
CORS(app)


############################################
# LOAD TRAINED MODEL + ENCODERS
############################################

model = joblib.load("layout_model.pkl")
encoders = joblib.load("label_encoders.pkl")


############################################
# LOAD MINI LM ZERO-SHOT MODEL
############################################

model_name = "cross-encoder/nli-MiniLM2-L6-H768"

# Suppress download warnings
import transformers
transformers.logging.set_verbosity_error()

tokenizer = AutoTokenizer.from_pretrained(model_name, local_files_only=False)
nli_model = AutoModelForSequenceClassification.from_pretrained(model_name, local_files_only=False)


############################################
# FEATURE COLUMN ORDER
############################################

input_columns = [
    "business_type",
    "content_type",
    "goal",
    "target_audience",
    "experience_level"
]


############################################
# FRONTEND COMPONENT LIST
############################################

components = [
    "hero_banner",
    "service_cards",
    "team_section",
    "gallery",
    "testimonials",
    "faq",
    "pricing_table",
    "contact_form",
    "newsletter",
    "blog_preview",
    "stats_counter",
    "call_to_action"
]


############################################
# ZERO-SHOT LABEL LISTS
############################################

business_types = [
    "ecommerce","blog","portfolio","startup","education",
    "restaurant","healthcare","real_estate","saas",
    "event","nonprofit","news","personal_brand"
]

content_types = [
    "products","articles","services","courses","gallery",
    "menu","booking","portfolio_items","events",
    "news_updates","downloads"
]

goals = [
    "sales","lead_generation","branding","education",
    "booking","awareness","portfolio_showcase",
    "community_building","content_delivery"
]

target_audience = [
    "general_public","students","business_clients",
    "recruiters","investors","patients",
    "local_customers","online_shoppers",
    "members","developers"
]

experience_levels = [
    "beginner","intermediate","advanced"
]


############################################
# ZERO-SHOT CLASSIFICATION FUNCTION
############################################

def zero_shot_classify(prompt, candidate_labels):

    scores = []

    for label in candidate_labels:

        hypothesis = f"This website is about {label}"

        inputs = tokenizer(
            prompt,
            hypothesis,
            return_tensors="pt",
            truncation=True
        )

        with torch.no_grad():

            logits = nli_model(**inputs).logits
            probs = torch.softmax(logits, dim=1)

            entailment_score = probs[0][2].item()

        scores.append(entailment_score)

    return candidate_labels[scores.index(max(scores))]


############################################
# FEATURE EXTRACTION FROM PROMPT
############################################

def extract_features(prompt):

    business = zero_shot_classify(prompt, business_types)

    content = zero_shot_classify(prompt, content_types)

    goal = zero_shot_classify(prompt, goals)

    audience = zero_shot_classify(prompt, target_audience)

    experience = "beginner"

    return [
        business,
        content,
        goal,
        audience,
        experience
    ]


############################################
# ENCODE FEATURES USING LABELENCODERS
############################################

def encode_features(features):

    encoded = []

    for i in range(len(features)):
        encoded_value = encoders[i].transform([features[i]])[0]
        encoded.append(encoded_value)

    return encoded


############################################
# MAIN API ROUTE
############################################

@app.route("/generate-layout", methods=["POST"])
def generate_layout():

    data = request.json


    ########################################
    # SUPPORT BOTH INPUT FORMATS
    ########################################

    # Always read businessType — used later for domain overrides
    businessType = data.get("businessType", "").lower().strip()

    if "prompt" in data:
        # legacy: single natural-language string
        prompt = data["prompt"]

    elif "concept" in data:
        # structured payload from frontend mappings
        # use concept as the NLP prompt; structured fields are passed
        # directly to override zero-shot extraction where available
        prompt = data["concept"]

    else:
        tone     = data.get("tone", "")
        audience = data.get("targetAudience", "")
        prompt = f"{businessType} {tone} {audience}".strip()


    if not prompt:

        return jsonify({"error": "No prompt provided"}), 400


    ########################################
    # EXTRACT FEATURES FROM PROMPT
    ########################################

    features = extract_features(prompt)


    ########################################
    # ENCODE FEATURES
    ########################################

    encoded = encode_features(features)

    encoded_df = pd.DataFrame(
        [encoded],
        columns=input_columns
    )


    ########################################
    # PREDICT COMPONENTS — PROBABILITY BASED
    ########################################

    # predict_proba returns one array per label: [[prob_0, prob_1], ...]
    prediction_proba = model.predict_proba(encoded_df)

    if businessType == "restaurant":
        THRESHOLD = 0.45
    elif businessType == "portfolio":
        THRESHOLD = 0.50
    elif businessType == "ecommerce":
        THRESHOLD = 0.55
    elif businessType == "saas":
        THRESHOLD = 0.60
    else:
        THRESHOLD = 0.50

    selected_components = []

    for i, comp in enumerate(components):
        prob = prediction_proba[i][0][1]   # [sample 0][class 1 = present]
        if prob > THRESHOLD:
            selected_components.append(comp)


    ########################################
    # KEYWORD BOOST (applied before cap)
    ########################################

    prompt_lower = prompt.lower()

    keyword_map = {
        "pricing": "pricing_table",
        "price":   "pricing_table",
        "team":    "team_section",
        "faq":     "faq",
        "newsletter": "newsletter",
        "blog":    "blog_preview",
        "stats":   "stats_counter",
        "gallery": "gallery",
        "contact": "contact_form"
    }

    for word, component in keyword_map.items():
        if word in prompt_lower and component not in selected_components:
            selected_components.append(component)


     ########################################
    # MINIMUM BLOCK FALLBACK
    # If threshold filtering yields fewer than
    # 4 components, pad with the next-highest
    # probability components until we reach 4.
    ########################################

    if len(selected_components) < 4:
        # Build (component, probability) pairs sorted by confidence desc
        sorted_blocks = sorted(
            [(comp, prediction_proba[i][0][1]) for i, comp in enumerate(components)],
            key=lambda x: x[1],
            reverse=True
        )
        for block, score in sorted_blocks:
            if block not in selected_components:
                selected_components.append(block)
            if len(selected_components) >= 4:
                break


    ########################################
    # GOAL-BASED SMART OVERRIDES
    ########################################

    # features[2] is the goal extracted by zero-shot classifier
    goal = features[2]

    if goal in ("booking", "lead_generation"):
        if "contact_form" not in selected_components:
            selected_components.append("contact_form")


    ########################################
    # ALWAYS INCLUDE CORE SECTIONS
    ########################################

    core_sections = ["hero_banner", "call_to_action"]

    for section in core_sections:
        if section not in selected_components:
            selected_components.append(section)


    ########################################
    # BUSINESS-TYPE DOMAIN OVERRIDES
    # Runs after core sections so dedup guard
    # covers both ML picks and guaranteed blocks.
    ########################################

    BUSINESS_TYPE_OVERRIDES = {
        "restaurant": ["gallery", "service_cards"],
        "saas":       ["pricing_table", "service_cards", "testimonials"],
        "portfolio":  ["gallery", "testimonials"],
        "ecommerce":  ["pricing_table", "service_cards"],
    }

    for block in BUSINESS_TYPE_OVERRIDES.get(businessType, []):
        if block not in selected_components:
            selected_components.append(block)


    ########################################
    # RETURN RESPONSE
    ########################################

    return jsonify({
        "success": True,
        "components": selected_components
    })


############################################
# RUN SERVER
############################################

if __name__ == "__main__":
    # Suppress Flask development server warning
    import sys
    cli = sys.modules['flask.cli']
    cli.show_server_banner = lambda *x: None
    
    print("✅ ML Service running on http://127.0.0.1:5050")
    app.run(port=5050, debug=False)