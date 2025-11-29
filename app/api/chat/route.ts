import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: `You are a helpful assistant for "My Memory" - a personal knowledge base application. 
You help users organize their thoughts, answer questions, and assist with their notes and memories.
Be friendly, concise, and helpful.`,
    messages,
  });

  return result.toTextStreamResponse();
}
