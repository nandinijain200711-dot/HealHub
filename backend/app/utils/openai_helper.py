import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.5-flash")


async def get_ai_health_insights(
    name: str,
    age: int,
    gender: str,
    symptoms: str,
    medical_condition: str
):
    try:

        prompt = f"""
You are a healthcare assistant.

User Details:
Name: {name}
Age: {age}
Gender: {gender}

Medical Condition:
{medical_condition}

Symptoms:
{symptoms}

Provide:

1. Possible health insights
2. General recommendations
3. Lifestyle suggestions
4. When to consult a doctor
5. Whether appointment booking is recommended

Do NOT provide diagnosis.
Always include medical disclaimer.
"""

        response = model.generate_content(prompt)

        return {
            "success": True,
            "insights": response.text,
            "disclaimer": "This is general health information only and not medical advice."
        }

    except Exception as e:
        print(f"Gemini Error: {e}")

        return {
            "success": False,
            "error": str(e),
            "insights": None
        }


async def generate_health_summary(chat_history):

    try:

        history_text = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in chat_history[-10:]
        ])

        prompt = f"""
Summarize the following health conversation:

{history_text}
"""

        response = model.generate_content(prompt)

        return response.text

    except Exception as e:
        print(f"Summary Error: {e}")
        return ""