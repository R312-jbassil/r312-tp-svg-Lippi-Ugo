import { OpenAI } from 'openai';

// Récupération des variables d'environnement
const HF_TOKEN = import.meta.env.HF_TOKEN;
const NOM_MODEL = import.meta.env.NOM_MODEL;
const HF_URL = import.meta.env.HF_URL;

const HF_TOKEN_V2 = import.meta.env.HF_TOKEN_V2;
const NOM_MODEL_V2 = import.meta.env.NOM_MODEL_V2;
const HF_URL_V2 = import.meta.env.HF_URL_V2;

export const POST = async ({ request }) => {
  console.log("Requête reçue");

  // ✅ Extraction de l'historique des messages et du modèle choisi
  const requestData = await request.json();
  console.log("Données de la requête:", requestData);
  const { messages, model } = requestData;
  console.log("Messages reçus:", messages);
  console.log("Modèle choisi:", model);

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Missing messages" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Sélection du modèle et de la configuration en fonction du choix de l'utilisateur
  let selectedModel, selectedToken, selectedURL;
  
  if (model === "openai/gpt-oss-20b:free") {
    selectedModel = NOM_MODEL_V2;
    selectedToken = HF_TOKEN_V2;
    selectedURL = HF_URL_V2;
  } else {
    // Par défaut, utiliser le modèle Llama
    selectedModel = NOM_MODEL;
    selectedToken = HF_TOKEN;
    selectedURL = HF_URL;
  }

  const client = new OpenAI({
    baseURL: selectedURL,
    apiKey: selectedToken,
  });

  const systemMessage = {
    role: "system",
    content: "You are an SVG code generator. Generate SVG code for the following messages. Make sure to include ids for each part of the generated SVG.",
  };

  try {
    const chatCompletion = await client.chat.completions.create({
      model: selectedModel,
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