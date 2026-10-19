import { Fragment, type ReactNode } from "react";
import type { StrapiBlock, StrapiTextNode } from "@/services/api";

type Child = StrapiTextNode | StrapiBlock;

const isTextNode = (child: Child): child is StrapiTextNode =>
  typeof (child as StrapiTextNode).text === "string";

const childrenText = (children?: Child[]): string =>
  (children ?? [])
    .map((child) => (isTextNode(child) ? child.text ?? "" : childrenText(child.children)))
    .join("");

// O campo "content" do Strapi guarda texto colado como blocos de parágrafo. Quando
// o conteúdo original continha HTML/CSS, essas linhas de folha de estilo aparecem
// como texto plano e não devem ser renderizadas no artigo.
const isCssLine = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/^(@|\.|#|\{|\})/.test(trimmed)) return true;
  if (/^[a-zA-Z-]+\s*:\s*.+;\s*$/.test(trimmed)) return true;
  return false;
};

const containsHtml = (text: string) => /<\s*[a-z][^>]*>/i.test(text);

// O HTML vem do próprio CMS, mas sanitizar evita XSS caso algum conteúdo
// colado carregue scripts ou atributos perigosos.
const sanitizeHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script, iframe, object, embed, style, link, meta").forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
      } else if ((name === "href" || name === "src") && /^\s*(javascript|data):/i.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return doc.body.innerHTML;
};

const headingTag = (level?: number) => {
  if (level === 1) return "h2";
  if (level === 2) return "h3";
  if (level === 3) return "h4";
  if (level === 4) return "h5";
  return "h6";
};

const headingClass = (level?: number) => {
  if (level === 1) return "pt-4 font-fraunces text-3xl text-[#0e302e]";
  if (level === 2) return "pt-3 font-fraunces text-2xl text-[#0e302e]";
  return "pt-2 font-fraunces text-xl text-[#0e302e]";
};

// Conteúdo antigo colado como código-fonte HTML chega achatado em parágrafos.
// As regras abaixo recuperam títulos e listas para o artigo não virar uma
// parede de texto sem hierarquia.
const isNumberMarker = (line: string) => /^\d{1,3}$/.test(line);

const isListItem = (line: string) => /^[^:]{1,60}:\s+.+[.!?]$/.test(line);

const isHeadingLike = (line: string) => {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.length > 9) return false;
  if (trimmed.length > 90) return false;
  if (/[.,;:]$/.test(trimmed)) return false;
  if (/^[0-9]/.test(trimmed) || /^[A-ZÀ-Ú]/.test(trimmed)) return true;
  return /^[a-zà-ú]/.test(trimmed) && /\?$/.test(trimmed);
};

const renderHtml = (html: string, key: number) => (
  <div key={key} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
);

// Indica se o bloco contém formatação inline ou links que precisam ser
// renderizados como elementos (em vez de texto achatado).
const hasInlineFormatting = (children?: Child[]): boolean =>
  (children ?? []).some((child) =>
    isTextNode(child)
      ? Boolean(child.bold || child.italic || child.underline || child.strikethrough || child.code)
      : child.type === "link" || hasInlineFormatting(child.children),
  );

const renderInlineNodes = (children: Child[]): ReactNode[] =>
  children.map((child, i) => {
    if (isTextNode(child)) {
      const text = child.text ?? "";
      let node: ReactNode = text;
      if (child.bold) node = <strong key={i}>{node}</strong>;
      if (child.italic) node = <em key={i}>{node}</em>;
      if (child.underline) node = <u key={i}>{node}</u>;
      if (child.strikethrough) node = <s key={i}>{node}</s>;
      if (child.code)
        node = (
          <code key={i} className="rounded bg-[#0e302e]/5 px-1.5 py-0.5 text-[0.9em]">
            {node}
          </code>
        );
      return <Fragment key={i}>{node}</Fragment>;
    }

    if (child.type === "link") {
      return (
        <a
          key={i}
          href={child.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#a07c3a] underline underline-offset-2"
        >
          {renderInlineNodes(child.children ?? [])}
        </a>
      );
    }

    return <Fragment key={i}>{renderInlineNodes(child.children ?? [])}</Fragment>;
  });

type Token =
  | { kind: "block"; node: ReactNode }
  | { kind: "line"; text: string }
  | { kind: "separator" };

const isLineToken = (token: Token): token is { kind: "line"; text: string } => token.kind === "line";

export function RichText({
  content,
  className = "",
}: {
  content?: StrapiBlock[] | null;
  className?: string;
}) {
  if (!Array.isArray(content)) return null;

  let key = 0;
  const nextKey = () => key++;

  const tokens: Token[] = [];

  content.forEach((block) => {
    if (!block) return;

    switch (block.type) {
      case "paragraph": {
        if (hasInlineFormatting(block.children)) {
          tokens.push({
            kind: "block",
            node: <p key={nextKey()}>{renderInlineNodes(block.children ?? [])}</p>,
          });
          return;
        }
        const text = childrenText(block.children).trim().replace(/\s+/g, " ");
        if (isCssLine(text)) return;
        if (!text) {
          tokens.push({ kind: "separator" });
          return;
        }
        tokens.push({ kind: "line", text });
        return;
      }
      case "heading": {
        const Tag = headingTag(block.level) as "h2" | "h3" | "h4" | "h5" | "h6";
        if (hasInlineFormatting(block.children)) {
          tokens.push({
            kind: "block",
            node: (
              <Tag key={nextKey()} className={headingClass(block.level)}>
                {renderInlineNodes(block.children ?? [])}
              </Tag>
            ),
          });
          return;
        }
        const text = childrenText(block.children).trim();
        tokens.push({
          kind: "block",
          node: containsHtml(text) ? (
            renderHtml(text, nextKey())
          ) : (
            <Tag key={nextKey()} className={headingClass(block.level)}>
              {text}
            </Tag>
          ),
        });
        return;
      }
      case "list": {
        const items = (block.children ?? []).filter(
          (child): child is StrapiBlock => !isTextNode(child) && child.type === "list-item",
        );
        const ListTag = block.format === "ordered" ? "ol" : "ul";
        tokens.push({
          kind: "block",
          node: (
            <ListTag key={nextKey()} className="space-y-3 pl-6">
              {items.map((item, i) => {
                if (hasInlineFormatting(item.children)) {
                  return (
                    <li key={i} className="list-disc">
                      {renderInlineNodes(item.children ?? [])}
                    </li>
                  );
                }
                const text = childrenText(item.children).trim();
                return containsHtml(text) ? (
                  <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />
                ) : (
                  <li key={i} className="list-disc">
                    {text}
                  </li>
                );
              })}
            </ListTag>
          ),
        });
        return;
      }
      case "quote": {
        if (hasInlineFormatting(block.children)) {
          tokens.push({
            kind: "block",
            node: (
              <blockquote key={nextKey()} className="border-l-2 border-[#c7a45b] pl-5 italic">
                {renderInlineNodes(block.children ?? [])}
              </blockquote>
            ),
          });
          return;
        }
        const text = childrenText(block.children).trim();
        tokens.push({
          kind: "block",
          node: containsHtml(text) ? (
            renderHtml(text, nextKey())
          ) : (
            <blockquote key={nextKey()} className="border-l-2 border-[#c7a45b] pl-5 italic">
              {text}
            </blockquote>
          ),
        });
        return;
      }
      case "code": {
        tokens.push({
          kind: "block",
          node: (
            <pre
              key={nextKey()}
              className="overflow-x-auto rounded-2xl bg-[#0e302e] p-5 text-sm leading-relaxed text-[#e2c88c]"
            >
              <code>{childrenText(block.children)}</code>
            </pre>
          ),
        });
        return;
      }
      case "image": {
        if (block.url) {
          tokens.push({
            kind: "block",
            node: (
              <img key={nextKey()} src={block.url} alt={block.alt ?? ""} className="w-full rounded-[1.6rem]" />
            ),
          });
        }
        return;
      }
      default:
        return;
    }
  });

  const nodes: ReactNode[] = [];
  let paragraph: string[] = [];
  let headingLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ");
    nodes.push(containsHtml(text) ? renderHtml(text, nextKey()) : <p key={nextKey()}>{text}</p>);
    paragraph = [];
  };

  const flushHeading = () => {
    if (!headingLines.length) return;
    nodes.push(
      <h2 key={nextKey()} className={headingClass(2)}>
        {headingLines.join(" ")}
      </h2>,
    );
    headingLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={nextKey()} className="space-y-3 pl-6">
        {listItems.map((item, i) => (
          <li key={i} className="list-disc">
            {item}
          </li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushHeading();
    flushList();
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.kind === "separator") {
      flushAll();
      continue;
    }

    if (token.kind === "block") {
      flushAll();
      nodes.push(token.node);
      continue;
    }

    if (!isLineToken(token)) continue;
    const line = token.text;

    if (isNumberMarker(line)) {
      flushParagraph();
      flushHeading();
      flushList();
      continue;
    }

    if (isListItem(line)) {
      flushParagraph();
      flushHeading();
      listItems.push(line);
      continue;
    }

    if (isHeadingLike(line)) {
      let end = i;
      while (end + 1 < tokens.length) {
        const next = tokens[end + 1];
        if (!isLineToken(next) || !isHeadingLike(next.text)) break;
        end++;
      }
      const after = tokens[end + 1];
      if (!after || after.kind !== "line") {
        flushParagraph();
        flushList();
        for (let j = i; j <= end; j++) {
          const heading = tokens[j];
          if (isLineToken(heading)) headingLines.push(heading.text);
        }
        i = end;
        continue;
      }
    }

    flushHeading();
    flushList();
    paragraph.push(line);
  }

  flushAll();

  return <div className={`space-y-6 text-lg leading-relaxed text-[#0e302e]/80 ${className}`}>{nodes}</div>;
}

export default RichText;
