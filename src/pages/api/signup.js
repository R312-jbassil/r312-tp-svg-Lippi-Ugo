import pb from "../../utils/pb";

export const POST = async ({ request }) => {
  const { email, password, passwordConfirm } = await request.json();

  try {
    const user = await pb.collection("users").create({
      email,
      password,
      passwordConfirm,
    });

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    console.error("Erreur d'inscription :", err);
    return new Response(JSON.stringify({ error: "Email déjà utilisé ou données invalides" }), { status: 400 });
  }
};