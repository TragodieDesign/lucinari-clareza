import { ArrowUpRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandImage from "@/components/BrandImage";
import { buildMediaUrl, getBlogPosts, type BlogPost } from "@/services/api";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const openChat = () => window.dispatchEvent(new Event("open-lucinari-chat"));

type Status = "loading" | "error" | "success";

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    document.title = "Blog | Lucinari Consulting";
    let active = true;
    setStatus("loading");
    getBlogPosts()
      .then((data) => {
        if (!active) return;
        setPosts(data);
        setStatus("success");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <main className="bg-[#f3eee1] px-6 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-outfit text-[11px] font-bold uppercase tracking-[.22em] text-[#a07c3a]">
          Blog · insights em gestão estratégica
        </p>
        <h1 className="mt-4 max-w-3xl font-fraunces text-5xl leading-[.98] lg:text-7xl">
          Ideias para decidir com mais clareza.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#0e302e]/70">
          Análises sobre governança corporativa, PMO estratégico, VMO, OKRs e gestão de portfólio.
        </p>

        <div className="mt-10 grid gap-4 rounded-[1.6rem] bg-[#0e302e] p-6 text-white md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#e2c88c]">
              Leitura de partida
            </p>
            <p className="mt-2 font-fraunces text-2xl">Decidir melhor começa por tornar o essencial visível.</p>
          </div>
          <button
            onClick={openChat}
            className="rounded-full bg-[#c7a45b] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-[#0e302e]"
          >
            Falar sobre seu contexto
          </button>
        </div>

        {status === "loading" && (
          <div className="mt-12 grid min-h-72 place-items-center rounded-[1.6rem] border border-[#0e302e]/10 bg-[#fffdf8]">
            <div className="flex flex-col items-center gap-3 text-[#0e302e]/60">
              <Loader2 className="animate-spin text-[#a07c3a]" size={26} />
              <p className="font-outfit text-xs font-bold uppercase tracking-wider">Carregando artigos…</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-12 rounded-[1.6rem] border border-[#0e302e]/10 bg-[#fffdf8] p-10 text-center">
            <p className="font-fraunces text-3xl">Não foi possível carregar os artigos.</p>
            <p className="mt-3 text-[#0e302e]/70">Verifique sua conexão e tente novamente.</p>
            <button
              onClick={() => setAttempt((n) => n + 1)}
              className="mt-6 rounded-full bg-[#0e302e] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-white"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {status === "success" &&
          (posts.length === 0 ? (
            <div className="mt-12 rounded-[1.6rem] border border-[#0e302e]/10 bg-[#fffdf8] p-10 text-center">
              <p className="font-fraunces text-3xl">Nenhum artigo publicado ainda.</p>
              <p className="mt-3 text-[#0e302e]/70">Volte em breve para conferir novos conteúdos.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {posts.map((post) => {
                const coverUrl = buildMediaUrl(post.cover?.url);
                return (
                  <article
                    key={post.slug}
                    className="flex min-h-80 flex-col overflow-hidden rounded-[1.6rem] border border-[#0e302e]/10 bg-[#fffdf8]"
                  >
                    {coverUrl ? (
                      <Link to={`/blog/${post.slug}`} className="block">
                        <BrandImage
                          src={coverUrl}
                          alt={post.title}
                          className="aspect-[16/9] w-full"
                          tone="mid"
                          label={post.title}
                        />
                      </Link>
                    ) : (
                      <Link to={`/blog/${post.slug}`} className="block aspect-[16/9] w-full bg-[#123c38]">
                        <div className="flex h-full items-center justify-center font-outfit text-[10px] font-bold uppercase tracking-widest text-[#e2c88c]">
                          Blog Lucinari
                        </div>
                      </Link>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#a07c3a]">
                        {formatDate(post.published_date)}
                      </div>
                      <h2 className="mt-5 font-fraunces text-3xl leading-tight">{post.title}</h2>
                      <p className="mt-4 text-sm leading-relaxed text-[#0e302e]/70">{post.excerpt}</p>
                      <Link
                        className="mt-auto flex items-center gap-2 pt-7 font-outfit text-xs font-bold uppercase tracking-wider"
                        to={`/blog/${post.slug}`}
                      >
                        Ler conteúdo <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
      </div>
    </main>
  );
};

export default BlogPage;
