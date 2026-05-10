type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{ text?: string; type?: string }>;
  }>;
};

export async function runOpenAIJson<T>({
  system,
  user,
  fallback,
}: {
  system: string;
  user: string;
  fallback: T;
}): Promise<T> {
  const apiKey =
    process.env.OPENAI_API_KEY ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) return fallback;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5.2",
      input: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      text: { format: { type: "json_object" } },
    }),
  });

  if (!res.ok) return fallback;
  const data = (await res.json()) as OpenAIResponse;
  const text =
    data.output_text ??
    data.output?.flatMap((o) => o.content ?? []).find((c) => c.text)?.text;
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function searchTavily(query: string) {
  const apiKey =
    process.env.TAVILY_API_KEY ?? process.env.NEXT_PUBLIC_TAVILY_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      search_depth: "advanced",
      max_results: 8,
      include_answer: true,
    }),
  });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    answer?: string;
    results?: Array<{ title?: string; url?: string; content?: string }>;
  };
  return [
    ...(data.answer ? [{ title: "Tavily answer", content: data.answer }] : []),
    ...(data.results ?? []),
  ];
}
