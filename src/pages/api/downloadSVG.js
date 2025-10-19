export async function POST({ request }) {
  try {
    const body = await request.json();
    const { svg, filename } = body;

    if (!svg) {
      return new Response(
        JSON.stringify({ error: "SVG content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Créer le nom de fichier avec un timestamp si non fourni
    const svgFilename = filename || `svg-${Date.now()}.svg`;

    // Retourner le SVG en tant que fichier téléchargeable
    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="${svgFilename}"`,
      },
    });
  } catch (error) {
    console.error("Error in downloadSVG:", error);
    return new Response(
      JSON.stringify({ error: "Failed to download SVG" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
