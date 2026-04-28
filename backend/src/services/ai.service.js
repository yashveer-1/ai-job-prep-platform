const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

// Initialize Google GenAI client
const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Define the expected structure of the interview report using Zod
const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  skillGapAnalysis: z.array(
    z.object({
      skill: z.string(),
      gapDescription: z.string(),
    })
  ),
  preparationTips: z.array(
    z.object({
      tip: z.string(),
    })
  ),
});

async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
const prompt = `
Generate an interview report.

Job Description:
${jobDescription}

Resume:
${resume}

Self Description:
${selfDescription}

Return ONLY valid JSON in this EXACT format:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillGapAnalysis": [
    {
      "skill": "string",
      "gapDescription": "string"
    }
  ],
  "preparationTips": [
    {
      "tip": "string"
    }
  ]
}


`;

  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

 let raw = response.text;

// remove ```json and ``` if present
raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

let report;
try {
  report = JSON.parse(raw);
} catch (e) {
  console.error("Invalid JSON from AI:", raw);
  throw e;
}

  const validatedReport = interviewReportSchema.parse(report);

  return validatedReport;
}

module.exports = {
  generateInterviewReport,
  interviewReportSchema,
};
