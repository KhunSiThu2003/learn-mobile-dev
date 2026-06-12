const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_KEY;

export async function askAI(prompt: string) {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    }
  );

  const data = await response.json();
  return data?.choices?.[0]?.message?.content;
}