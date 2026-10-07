import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BrandImage from "@/components/BrandImage";
import RichText from "@/components/RichText";
import { setJsonLd, setSeo } from "@/lib/seo";
import { buildMediaUrl, getBlogPostBySlug, type BlogPost } from "@/services/api";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const openChat = () => window.dispatchEvent(new Event("open-lucinari-chat"));

type Status = "loading" | "error" | "notfound" | "success";

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setStatus("loading");
    getBlogPostBySlug(slug)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setPost(null);
          setStatus("notfound");
          return;
        }
        setPost(data);
        setStatus("success");
        const coverUrl = buildMediaUrl(data.cover?.url);
        const canonicalUrl = `${window.location.origin}/blog/${data.slug}`;
        setSeo({
          title: `${data.title} | Lucinari Consulting`,
          description: data.excerpt,
          image: coverUrl,
          url: canonicalUrl,
          type: "article",
        });
        setJsonLd("blog-post", {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: data.title,
          description: data.excerpt,
          image: coverUrl,
          datePublished: data.published_date,
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          publisher: { "@type": "Organization", name: "Lucinari Consulting" },
        });
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [slug, attempt]);

  if (status === "loading") {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#fffdf8] px-6">
        <div className="flex flex-col items-center gap-3 text-[#0e302e]/60">
          <Loader2 className="animate-spin text-[#a07c3a]" size={26} />
          <p className="font-outfit text-xs font-bold uppercase tracking-wider">Carregando artigo…</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#fffdf8] px-6">
        <div className="text-center">
          <p className="font-fraunces text-3xl">Não foi possível carregar este artigo.</p>
          <p className="mt-3 text-[#0e302e]/70">Verifique sua conexão e tente novamente.</p>
          <button
            onClick={() => setAttempt((n) => n + 1)}
            className="mt-6 rounded-full bg-[#0e302e] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-white"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  if (status === "notfound" || !post) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#fffdf8] px-6">
        <div className="text-center">
          <p className="font-fraunces text-3xl">Artigo não encontrado.</p>
          <p className="mt-3 text-[#0e302e]/70">
            O conteúdo pode ter sido removido ou o endereço está incorreto.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0e302e] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-white"
          >
            Voltar ao blog <ArrowLeft size={15} />
          </Link>
        </div>
      </main>
    );
  }

  const coverUrl = buildMediaUrl(post.cover?.url);

  return (
    <main className="bg-[#fffdf8] px-6 py-16 lg:px-10 lg:py-24">
      <article className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-outfit text-[10px] font-bold uppercase tracking-[.16em] text-[#a07c3a]"
        >
          <ArrowLeft size={14} /> Blog
        </Link>
        <div className="mt-6 font-outfit text-[10px] font-bold uppercase tracking-[.16em] text-[#a07c3a]">
          Blog · {formatDate(post.published_date)}
        </div>
        <h1 className="mt-5 font-fraunces text-5xl leading-[.98] lg:text-7xl">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-7 border-l-2 border-[#c7a45b] pl-5 text-xl leading-relaxed text-[#0e302e]/75">
            {post.excerpt}
          </p>
        )}
        {coverUrl && (
          <BrandImage
            src={coverUrl}
            alt={post.title}
            className="mt-10 aspect-[16/9] w-full rounded-[1.6rem]"
            tone="mid"
            label={post.title}
          />
        )}
        <div className="mt-12">
          <RichText content={post.content} />
        </div>
        <aside className="my-14 rounded-[1.6rem] bg-[#0e302e] p-8 text-white">
          <p className="font-outfit text-[10px] font-bold uppercase tracking-[.18em] text-[#e2c88c]">
            Próximo passo
          </p>
          <h2 className="mt-3 font-fraunces text-3xl">
            Quer trazer este tema para a realidade da sua organização?
          </h2>
          <button
            onClick={openChat}
            className="mt-6 rounded-full bg-[#c7a45b] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-[#0e302e]"
          >
            Falar com especialista
          </button>
        </aside>
      </article>
    </main>
  );
};

export default BlogPostPage;
