import { OpenAI } from 'openai';

// Récupération des variables d'environnement
const HF_TOKEN = import.meta.env.HF_TOKEN_V2;
const NOM_MODEL = import.meta.env.NOM_MODEL_V2;
const HF_URL = import.meta.env.HF_URL_V2;

export const POST = async ({ request }) => {
  console.log("Requête reçue");

  // ✅ Extraction de l'historique des messages
  const requestData = await request.json();
  console.log("Données de la requête:", requestData);
  const { messages } = requestData;
  console.log("Messages reçus:", messages);

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Missing messages" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new OpenAI({
    baseURL: HF_URL,
    apiKey: HF_TOKEN,
  });

  const systemMessage = {
    role: "system",
    content: "You are an SVG code generator. Generate SVG code for the following messages. Make sure to include ids for each part of the generated SVG.",
  };

  try {
    const chatCompletion = await client.chat.completions.create({
      model: NOM_MODEL,
      messages: [systemMessage, ...messages],
    });

    const message = chatCompletion.choices?.[0]?.message ?? { role: "assistant", content: "" };
    const svgMatch = message.content.match(/<svg[\s\S]*?<\/svg>/i);
    message.content = svgMatch ? svgMatch[0] : "";

    console.log("Generated SVG:", message);

    return new Response(JSON.stringify({ svg: message }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la génération du SVG." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};