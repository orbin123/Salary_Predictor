import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { projects } = req.body;
  if (!projects || !Array.isArray(projects)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const prompt = `You must respond with ONLY a JSON array of exactly three numbers between 1 and 10, representing scores for each project. For example: [7, 8, 6]. Do not include any other text or explanation.

Project evaluations:
${projects.map((p, i) => `Project ${i + 1}: ${p}`).join("\n\n")}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Lower temperature for more consistent formatting
    });

    const text = response.choices[0].message.content?.trim() || "[]";

    // Add error handling and cleaning of the response
    let scores;
    try {
      // Try to extract just the array if there's extra text
      const match = text.match(/\[.*?\]/);
      if (match) {
        scores = JSON.parse(match[0]);
      } else {
        // If no array found, try to extract numbers
        scores = text.match(/\d+/g)?.map(Number).slice(0, 3) || [];
      }

      // Validate scores
      if (
        !Array.isArray(scores) ||
        scores.length !== 3 ||
        !scores.every((s) => typeof s === "number" && s >= 1 && s <= 10)
      ) {
        throw new Error("Invalid scores format");
      }
    } catch (parseError) {
      console.error("Parsing Error:", parseError, "Original text:", text);
      return res
        .status(500)
        .json({ message: "Failed to parse evaluation scores" });
    }

    return res.status(200).json({ scores });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ message: "OpenAI failed to evaluate" });
  }
}
