const PUBLIC_PATHS = [
  "/",
  "/about",
  "/privacy-policy",
  "/supported-bank-statements",
  "/terms-of-use",
];

export function loader({ request }: { request: Request }) {
  const origin = new URL(request.url).origin;
  const urls = PUBLIC_PATHS.map((path) => {
    const loc = path === "/" ? `${origin}/` : `${origin}${path}`;
    return ["  <url>", `    <loc>${loc}</loc>`, "  </url>"].join("\n");
  }).join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
