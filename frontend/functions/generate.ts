import Groq from "groq-sdk";

const model =
  process.env.GROQ_MODEL ||
  process.env.NEXT_PUBLIC_GROQ_MODEL ||
  "deepseek-r1-distill-qwen-32b";

const groq = new Groq({
  apiKey:
    process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

async function generate(prompt: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });

  const contentWithThoughts = response.choices[0].message.content;
  console.log(contentWithThoughts);
  // const contentWithoutThoughts = contentWithThoughts?.replace(/<think>.*?<\/think>/g, "");
  const contentWithoutThoughts = contentWithThoughts?.split("</think>");
  console.log("Content without thoughts:", contentWithoutThoughts);
  return contentWithThoughts ?? "";
}

async function generateImage(prompt: string): Promise<string> {
  const response = await fetch(
    "https://api.corcel.io/v1/image/vision/text-to-image",
    {
      method: "POST",
      headers: {
        Authorization:
          process.env.CORCEL_API_KEY ||
          process.env.NEXT_PUBLIC_CORCEL_API_KEY ||
          "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cfg_scale: 2,
        height: "1024",
        width: "1024",
        steps: 8,
        engine: "dreamshaper",
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
        ],
      }),
    }
  );
  const data = await response.json();
  return data.signed_urls[0] || "";
}

export { generate, generateImage };
