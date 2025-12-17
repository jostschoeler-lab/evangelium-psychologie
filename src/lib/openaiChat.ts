const DEFAULT_MODEL = "gpt-4o-mini";

type ChatCompletionChoice = {
  message?: {
    content?: string;
  };
};

type ChatCompletionResponse = {
  choices?: ChatCompletionChoice[];
};

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Bitte hinterlege einen gültigen OpenAI-API-Key in der Umgebungsvariable VITE_OPENAI_API_KEY."
    );
  }
  return apiKey;
}

function getModel(): string {
  return import.meta.env.VITE_OPENAI_MODEL || DEFAULT_MODEL;
}

export async function runChatCompletion(prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`
    },
    body: JSON.stringify({
      model: getModel(),
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      errorText ||
        `Fehler bei der Anfrage an OpenAI (Status ${response.status}). Bitte versuche es erneut.`
    );
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Von OpenAI kam keine verwertbare Antwort zurück.");
  }

  return content;
}
