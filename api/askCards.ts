type AskCardsRequestBody = {
  question?: unknown;
  cards?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

export default async function handler(req: any, res: any) {
  // Optional CORS for dev / external calls
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const reqBody = (req.body ?? {}) as AskCardsRequestBody;

  if (!isNonEmptyString(reqBody.question) || !isStringArray(reqBody.cards) || reqBody.cards.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("POST /api/askCards received:", {
      question: reqBody.question,
      cards: reqBody.cards,
    });

    const apiKey = process.env.OPENAI_API_KEY;

    if (!isNonEmptyString(apiKey)) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const titles = reqBody.cards.map((c) => c.trim()).filter(Boolean);

    const prompt = [
      `User question: ${reqBody.question}`,
      `Cards drawn: ${titles.join(", ")}`,
      "Give a tarot reading. If needed, infer standard meanings and a likely orientation (upright/reversed) but do not mention that you are guessing.",
    ].join("\n");

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
      }),
    });

    const rawText = await openaiRes.text();

    if (!openaiRes.ok) {
      console.error("OpenAI API error:", rawText);
      return res
        .status(openaiRes.status)
        .json({ error: "OpenAI API request failed", details: rawText });
    }

    const data = JSON.parse(rawText) as any;
    const answer: unknown = data?.output_text;

    if (!isNonEmptyString(answer)) {
      return res.status(500).json({ error: "OpenAI response missing output_text" });
    }

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
