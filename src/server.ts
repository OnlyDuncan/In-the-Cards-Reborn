import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

app.use(express.json());

// CORS (hard-coded for local dev)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

interface AskCardsRequestBody {
  question: string;
  cards: string[];
}

app.get('/health', (_req: Request, res: Response) => {
  res.send('OK');
});

app.post('/api/askCards', async (req: Request, res: Response) => {
  try {
    console.log('POST /api/askCards');
    console.log('req.body:', req.body);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is missing on the server' });
    }

    const reqBody = req.body as AskCardsRequestBody;

    if (!reqBody?.question) {
      return res.status(400).json({ error: 'Invalid request body. Missing "question".' });
    }

    if (!Array.isArray(reqBody.cards)) {
      return res.status(400).json({ error: 'Invalid request body. "cards" must be an array of strings.' });
    }

    if (reqBody.cards.length === 0) {
      return res.status(400).json({ error: 'Invalid request body. "cards" array is empty.' });
    }

    const badCardIndex = reqBody.cards.findIndex((c) => typeof c !== 'string' || c.trim().length === 0);
    if (badCardIndex !== -1) {
      return res.status(400).json({
        error: 'Invalid card title. Expected each card to be a non-empty string.',
        badCardIndex,
        badCard: reqBody.cards[badCardIndex],
      });
    }

    const titles = reqBody.cards.map((c) => c.trim());

    const prompt = [
      `User question: ${reqBody.question}`,
      `Cards drawn: ${titles.join(', ')}`,
      'Give a tarot reading. If needed, infer standard meanings and a likely orientation (upright/reversed) but do not mention that you are guessing.',
    ].join('\n');

    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: prompt,
      }),
    });

    const rawText = await openaiRes.text();

    if (!openaiRes.ok) {
      console.error('OpenAI error:', rawText);
      return res.status(502).json({ error: 'OpenAI request failed', details: rawText });
    }

    const data = JSON.parse(rawText) as any;

    const answer: string =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      data.output
        ?.map((o: any) => o?.content?.map((c: any) => c?.text).filter(Boolean).join(' '))
        .filter(Boolean)
        .join('\n') ||
      'No answer available.';

    return res.json({ answer });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = Number(process.env.PORT) || 5050;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
