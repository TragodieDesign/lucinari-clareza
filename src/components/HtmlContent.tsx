import { useMemo } from "react";
import { STRAPI_ORIGIN } from "@/services/api";

// O novo formato de "content" do blog é um documento HTML completo colado no
// CMS. Antes de renderizar, removemos elementos perigosos, reescrevemos URLs
// relativas para o backend e descartamos as partes que a página já exibe
// (herói, selo, título e lead).
const prepareHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc
    .querySelectorAll("script, iframe, object, embed, style, link, meta, base")
    .forEach((el) => el.remove());

  doc.querySelectorAll("header.hero, .badge, h1, p.lead").forEach((el) => el.remove());

  doc.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
      } else if (
        (name === "href" || name === "src") &&
        /^\s*(javascript|data|vbscript):/i.test(attr.value)
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  doc.querySelectorAll("img, a").forEach((el) => {
    const attr = el.tagName === "IMG" ? "src" : "href";
    const value = el.getAttribute(attr);
    if (!value) return;
    const trimmed = value.trim();
    if (/^(https?:)?\/\//i.test(trimmed)) return;
    if (/^(#|mailto:|tel:)/i.test(trimmed)) return;
    el.setAttribute(attr, `${STRAPI_ORIGIN}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`);
  });

  // Links markdown simples [texto](url) aparecem como texto corrido no CMS.
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  textNodes.forEach((node) => {
    const text = node.nodeValue ?? "";
    const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const fragment = doc.createDocumentFragment();
    let lastIndex = 0;
    let changed = false;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text))) {
      changed = true;
      if (match.index > lastIndex) {
        fragment.appendChild(doc.createTextNode(text.slice(lastIndex, match.index)));
      }
      const anchor = doc.createElement("a");
      anchor.href = match[2];
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = match[1];
      fragment.appendChild(anchor);
      lastIndex = match.index + match[0].length;
    }

    if (changed) {
      if (lastIndex < text.length) {
        fragment.appendChild(doc.createTextNode(text.slice(lastIndex)));
      }
      node.parentNode?.replaceChild(fragment, node);
    }
  });

  const root = doc.querySelector("div.content") ?? doc.querySelector("article") ?? doc.body;
  return root.innerHTML;
};

const HtmlContent = ({ html, className = "" }: { html: string; className?: string }) => {
  const prepared = useMemo(() => prepareHtml(html), [html]);

  return (
    <div
      className={`html-article ${className}`}
      dangerouslySetInnerHTML={{ __html: prepared }}
    />
  );
};

export default HtmlContent;
