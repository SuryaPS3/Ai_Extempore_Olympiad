import asyncio
import os

from dotenv import load_dotenv
from google.antigravity import Agent, LocalAgentConfig

# Load environment variables from .env
load_dotenv()

# Verify API key exists
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY not found. Make sure it is present in your .env file."
    )

# System Instructions
SYSTEM_INSTRUCTIONS = """
You are an expert public speaking teacher. You are evaluating an extempore speech.

You must grade the student strictly out of 100 points based on the following criteria:
- Content and Ideas: 20 marks
- Clarity of Speech: 20 marks
- Confidence & Emotion: 15 marks
- Creativity: 15 marks
- Time Management: 15 marks
- Overall Impact: 15 marks

Adjust your expectations based on the student's Grade Level.

You must output YOUR ENTIRE RESPONSE as a valid JSON object matching this schema:

{
  "content_score": int,
  "clarity_score": int,
  "confidence_score": int,
  "creativity_score": int,
  "time_score": int,
  "impact_score": int,
  "total_score": int,
  "ai_feedback": "A 2-3 sentence encouraging feedback message."
}

DO NOT output any markdown blocks.
DO NOT output any text before or after the JSON.
Return only the raw JSON object.
"""


async def test_grading_logic(
    grade_level: str,
    topic: str,
    transcript: str
):
    config = LocalAgentConfig(
        system_instructions=SYSTEM_INSTRUCTIONS
    )

    prompt = f"""
STUDENT PROFILE:
- Grade Level: {grade_level}
- Assigned Topic: {topic}

STUDENT TRANSCRIPT:
"{transcript}"
"""

    print(f"\nEvaluating {grade_level} student")
    print(f"Topic: {topic}")
    print("-" * 50)

    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        result_text = await response.text()

        print("AI GRADING OUTPUT:")
        print(result_text)
        print("-" * 50)


async def main():
    print("Gemini API Key Loaded Successfully")
    print()

    # Test Case 1
    await test_grading_logic(
        grade_level="Class 3",
        topic="My Favorite Animal",
        transcript=(
            "I love dogs. My dog is brown and he plays fetch with me. "
            "Sometimes he barks at the mailman but he is a very good boy. "
            "I want to be a vet when I grow up."
        )
    )

    # Test Case 2
    await test_grading_logic(
        grade_level="Class 9",
        topic="Climate Change",
        transcript=(
            "Um, climate change is bad. The earth is getting hot. "
            "Um, we should stop using cars so much. And... yeah, "
            "pollution is destroying the trees."
        )
    )


if __name__ == "__main__":
    asyncio.run(main())