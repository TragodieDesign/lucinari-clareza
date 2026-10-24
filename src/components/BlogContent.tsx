import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import HtmlContent from "@/components/HtmlContent";
import RichText from "@/components/RichText";
import { STRAPI_ORIGIN, type StrapiBlock, type StrapiTextNode } from "@/services/api";

const isHtml = (text: string) => /^\s*(?:<!doctype\s+html|<(?:html|body|article|section|div|header|p|h[1-6]|ul|ol|table|blockquote|figure|img)\b)/i.test(text);
const hasMarkdown = (text: string) => /(^|\n)\s*(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s|```|~~~)|!?\[[^\]]*\]\(|\*\*[^*]+\*\*/.test(text);

const inlineMarkdown = (nodes: (StrapiBlock | StrapiTextNode)[] = []): string => nodes.map((node) => {
  if ("text" in node) {
    let text = node.text ?? "";
    if (node.code) text = `\`${text}\``;
    if (node.bold) text = `**${text}**`;
    if (node.italic) text = `*${text}*`;
    if (node.strikethrough) text = `~~${text}~~`;
    return text;
  }
  const block = node as StrapiBlock;
  const text = inlineMarkdown(block.children);
  return block.type === "link" ? `[${text}](<${block.url ?? ""}>)` : text;
}).join("");

const resolveUrl = (url: string) => {
  const safe = defaultUrlTransform(url);
  if (!safe) return "";
  if (/^(?:https?:\/\/|\/\/|#|mailto:|tel:)/i.test(safe)) return safe;
  return new URL(safe, `${STRAPI_ORIGIN}/`).href;
};

const BlogContent = ({ content }: { content: string | StrapiBlock[] }) => {
  let markdown: string;
  if (typeof content === "string") {
    if (isHtml(content)) return <HtmlContent html={content} />;
    markdown = content;
  } else {
    // Conteúdos antigos em Markdown também podem chegar como parágrafos de blocos Strapi.
    const text = content.map((block) => inlineMarkdown(block.children)).join("\n\n");
    if (!content.every((block) => block.type === "paragraph") || isHtml(text) || !hasMarkdown(text)) {
      return <RichText content={content} />;
    }
    markdown = text;
  }

  return (
    <div className="space-y-6 leading-relaxed text-[#0e302e]/80">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={resolveUrl}
        components={{
          h1: ({ children }) => <h2 className="pt-4 font-fraunces text-4xl leading-tight text-[#0e302e]">{children}</h2>,
          h2: ({ children }) => <h2 className="pt-4 font-fraunces text-3xl leading-tight text-[#0e302e]">{children}</h2>,
          h3: ({ children }) => <h3 className="pt-3 font-fraunces text-2xl leading-tight text-[#0e302e]">{children}</h3>,
          h4: ({ children }) => <h4 className="pt-2 font-fraunces text-xl text-[#0e302e]">{children}</h4>,
          h5: ({ children }) => <h5 className="pt-2 font-fraunces text-lg text-[#0e302e]">{children}</h5>,
          h6: ({ children }) => <h6 className="pt-2 font-fraunces text-base font-bold text-[#0e302e]">{children}</h6>,
          a: ({ href, children }) => <a href={href} className="break-words text-[#a07c3a] underline underline-offset-2" target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{children}</a>,
          img: ({ src, alt, title }) => <img src={src} alt={alt ?? ""} title={title} loading="lazy" className="my-6 h-auto w-full rounded-[1.6rem]" />,
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
          blockquote: ({ children }) => <blockquote className="space-y-3 border-l-2 border-[#c7a45b] pl-5 italic">{children}</blockquote>,
          pre: ({ children }) => <pre className="overflow-x-auto rounded-2xl bg-[#0e302e] p-5 text-sm text-[#e2c88c]">{children}</pre>,
          code: ({ children }) => <code className="rounded bg-[#0e302e]/5 px-1 py-0.5 font-mono text-[.9em]">{children}</code>,
          table: ({ children }) => <div className="overflow-x-auto rounded-xl border border-[#0e302e]/15"><table className="w-full border-collapse text-left text-sm">{children}</table></div>,
          th: ({ children }) => <th className="border-b border-[#0e302e]/15 bg-[#f3eee1] px-4 py-3 font-semibold">{children}</th>,
          td: ({ children }) => <td className="border-b border-[#0e302e]/10 px-4 py-3">{children}</td>,
          hr: () => <hr className="border-[#c7a45b]/40" />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default BlogContent;
