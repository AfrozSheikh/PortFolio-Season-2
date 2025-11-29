
import { NextResponse } from 'next/server';
import { portfolioChat } from '@/ai/flows/chatbot';
import { Message } from 'genkit';

export async function POST(req: Request) {
  try {
    const { history, message } = await req.json();

    const genkitHistory: Message[] = history.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      content: [{ text: msg.text }],
    }));

    const stream = await portfolioChat({
      history: genkitHistory,
      message,
    });

    // Return a streaming response
    return new Response(stream as any, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
