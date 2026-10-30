import type { MetadataRoute } from "next";

/**
 * robots AMSANTÉ — tout est crawlable, sauf les panneaux de dev
 * et les chemins d'API éventuels. Le sitemap est déclaré explicitement.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://amsante.ml";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dev/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
