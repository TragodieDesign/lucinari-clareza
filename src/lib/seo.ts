export type SeoInput = {
  title: string;
  description?: string;
  image?: string | null;
  url?: string;
  type?: "website" | "article";
};

const upsertMeta = (selector: string, attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

// Atualiza as meta tags de SEO para a página atual. As tags og:*/twitter:*
// garantem que a capa e o resumo do artigo apareçam ao compartilhar/indexar.
export function setSeo({ title, description, image, url, type = "website" }: SeoInput) {
  document.title = title;

  if (description) upsertMeta('meta[name="description"]', "name", "description", description);

  upsertMeta('meta[property="og:title"]', "property", "og:title", title);
  upsertMeta('meta[property="og:type"]', "property", "og:type", type);
  if (description) upsertMeta('meta[property="og:description"]', "property", "og:description", description);
  if (url) {
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertCanonical(url);
  }
  if (image) {
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    upsertMeta('meta[property="og:image:secure_url"]', "property", "og:image:secure_url", image);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
  }

  upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", image ? "summary_large_image" : "summary");
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
  if (description) upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
}

// Injeta dados estruturados (JSON-LD) que ajudam mecanismos de busca a
// entender e indexar o conteúdo da página.
export function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-jsonld", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}
