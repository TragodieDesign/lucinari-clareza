import type { ReactNode } from "react";
import type { StrapiBlock, StrapiTextNode } from "@/services/api";

type Child = StrapiTextNode | StrapiBlock;

const childrenText = (children?: Child[]): string =>
  (children ?? [])
    .map((child) => ("text" in child ? child.text ?? "" : childrenText(child.children)))
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

export function RichText({
  content,
  className = "",
}: {
  content?: StrapiBlock[] | null;
  className?: string;
}) {
  if (!Array.isArray(content)) return null;

  const nodes: ReactNode[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    nodes.push(<p key={`p-${nodes.length}`}>{paragraph.join(" ")}</p>);
    paragraph = [];
  };

  content.forEach((block, index) => {
    if (!block) return;

    switch (block.type) {
      case "paragraph": {
        const text = childrenText(block.children).trim();
        if (isCssLine(text)) return;
        if (!text) {
          flushParagraph();
          return;
        }
        paragraph.push(text);
        break;
      }
      case "heading": {
        flushParagraph();
        const Tag = headingTag(block.level) as "h2" | "h3" | "h4" | "h5" | "h6";
        nodes.push(
          <Tag key={`h-${index}`} className={headingClass(block.level)}>
            {childrenText(block.children)}
          </Tag>,
        );
        break;
      }
      case "list": {
        flushParagraph();
        const items = (block.children ?? [])
          .filter((child): child is StrapiBlock => !("text" in child) && child.type === "list-item")
          .map((item) => childrenText(item.children).trim());
        const ListTag = block.format === "ordered" ? "ol" : "ul";
        nodes.push(
          <ListTag key={`l-${index}`} className="space-y-3 pl-6">
            {items.map((item, i) => (
              <li key={i} className="list-disc">
                {item}
              </li>
            ))}
          </ListTag>,
        );
        break;
      }
      case "quote": {
        flushParagraph();
        nodes.push(
          <blockquote key={`q-${index}`} className="border-l-2 border-[#c7a45b] pl-5 italic">
            {childrenText(block.children)}
          </blockquote>,
        );
        break;
      }
      case "code": {
        flushParagraph();
        nodes.push(
          <pre
            key={`c-${index}`}
            className="overflow-x-auto rounded-2xl bg-[#0e302e] p-5 text-sm leading-relaxed text-[#e2c88c]"
          >
            <code>{childrenText(block.children)}</code>
          </pre>,
        );
        break;
      }
      case "image": {
        flushParagraph();
        if (block.url) {
          nodes.push(
            <img key={`img-${index}`} src={block.url} alt={block.alt ?? ""} className="w-full rounded-[1.6rem]" />,
          );
        }
        break;
      }
      default:
        break;
    }
  });

  flushParagraph();

  return <div className={`space-y-6 text-lg leading-relaxed text-[#0e302e]/80 ${className}`}>{nodes}</div>;
}

export default RichText;
