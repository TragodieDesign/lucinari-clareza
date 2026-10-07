import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RichText from "@/components/RichText";
import {
  getCases,
  getCaseBySlug,
  getKnowledges,
  getKnowledgeBySlug,
  type CaseStudy,
  type KnowledgeItem,
  type StrapiBlock,
} from "@/services/api";

const formatDate = (value?: string | null): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const openChat = () => window.dispatchEvent(new Event("open-lucinari-chat"));

type Item = {
  slug: string;
  title: string;
  excerpt: string;
  body: StrapiBlock[];
  eyebrow: string | null;
};

const mapCase = (entry: CaseStudy): Item => ({
  slug: entry.slug,
  title: entry.title,
  excerpt: entry.excerpt,
  body: entry.description,
  eyebrow: "Case",
});

const mapKnowledge = (entry: KnowledgeItem): Item => ({
  slug: entry.slug,
  title: entry.title,
  excerpt: entry.excerpt,
  body: entry.content,
  eyebrow: formatDate(entry.published_date),
});

type CollectionConfig = {
  label: string;
  keyword: string;
  title: string;
  intro: string;
  backPath: string;
  backLabel: string;
  list: () => Promise<Item[]>;
  one: (slug: string) => Promise<Item | null>;
};

const collections: Record<"cases" | "conhecimentos", CollectionConfig> = {
  cases: {
    label: "Cases",
    keyword: "palestras, treinamentos e cases de gestão",
    title: "Conhecimento e transformações que geram valor.",
    intro: "Palestras, treinamentos e projetos que conectam estratégia, execução e valor.",
    backPath: "/cases",
    backLabel: "Cases",
    list: async () => (await getCases()).map(mapCase),
    one: async (slug) => {
      const entry = await getCaseBySlug(slug);
      return entry ? mapCase(entry) : null;
    },
  },
  conhecimentos: {
    label: "Centro de Conhecimento",
    keyword: "guias de governança e PMO",
    title: "Conhecimento aplicado à sua decisão.",
    intro: "Guias e materiais para transformar temas complexos em próximos passos concretos.",
    backPath: "/conhecimentos",
    backLabel: "Conhecimentos",
    list: async () => (await getKnowledges()).map(mapKnowledge),
    one: async (slug) => {
      const entry = await getKnowledgeBySlug(slug);
      return entry ? mapKnowledge(entry) : null;
    },
  },
};

type ListKind = "cases" | "conhecimentos";

const ListView = ({ kind }: { kind: ListKind }) => {
  const cfg = collections[kind];
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    document.title = `${cfg.label} | Lucinari Consulting`;
    let active = true;
    setStatus("loading");
    cfg.list()
      .then((data) => {
        if (!active) return;
        setItems(data);
        setStatus("success");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [attempt, kind]);

  return (
    <main className="bg-[#f3eee1] px-6 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-outfit text-[11px] font-bold uppercase tracking-[.22em] text-[#a07c3a]">
          {cfg.label} · {cfg.keyword}
        </p>
        <h1 className="mt-4 max-w-3xl font-fraunces text-5xl leading-[.98] lg:text-7xl">{cfg.title}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#0e302e]/70">{cfg.intro}</p>

        {status === "loading" && (
          <div className="mt-12 grid min-h-72 place-items-center rounded-[1.6rem] border border-[#0e302e]/10 bg-[#fffdf8]">
            <div className="flex flex-col items-center gap-3 text-[#0e302e]/60">
              <Loader2 className="animate-spin text-[#a07c3a]" size={26} />
              <p className="font-outfit text-xs font-bold uppercase tracking-wider">Carregando…</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-12 rounded-[1.6rem] border border-[#0e302e]/10 bg-[#fffdf8] p-10 text-center">
            <p className="font-fraunces text-3xl">Não foi possível carregar os conteúdos.</p>
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
          (items.length === 0 ? (
            <div className="mt-12 rounded-[1.6rem] border border-[#0e302e]/10 bg-[#fffdf8] p-10 text-center">
              <p className="font-fraunces text-3xl">Nenhum conteúdo publicado ainda.</p>
              <p className="mt-3 text-[#0e302e]/70">Volte em breve para conferir novidades.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.slug}
                  className="flex min-h-80 flex-col rounded-[1.6rem] border border-[#0e302e]/10 bg-[#fffdf8] p-6"
                >
                  {item.eyebrow && (
                    <div className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#a07c3a]">
                      {item.eyebrow}
                    </div>
                  )}
                  <h2 className="mt-6 font-fraunces text-3xl leading-tight">{item.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#0e302e]/70">{item.excerpt}</p>
                  <Link
                    className="mt-auto flex items-center gap-2 pt-7 font-outfit text-xs font-bold uppercase tracking-wider"
                    to={`${cfg.backPath}/${item.slug}`}
                  >
                    Ler conteúdo <ArrowUpRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          ))}
      </div>
    </main>
  );
};

const DetailView = ({ kind }: { kind: ListKind }) => {
  const { slug } = useParams();
  const cfg = collections[kind];
  const [item, setItem] = useState<Item | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "notfound" | "success">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setStatus("loading");
    cfg.one(slug)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setItem(null);
          setStatus("notfound");
          return;
        }
        setItem(data);
        setStatus("success");
        document.title = `${data.title} | Lucinari Consulting`;
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [slug, attempt, kind]);

  if (status === "loading") {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#fffdf8] px-6">
        <div className="flex flex-col items-center gap-3 text-[#0e302e]/60">
          <Loader2 className="animate-spin text-[#a07c3a]" size={26} />
          <p className="font-outfit text-xs font-bold uppercase tracking-wider">Carregando conteúdo…</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#fffdf8] px-6">
        <div className="text-center">
          <p className="font-fraunces text-3xl">Não foi possível carregar este conteúdo.</p>
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

  if (status === "notfound" || !item) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#fffdf8] px-6">
        <div className="text-center">
          <p className="font-fraunces text-3xl">Conteúdo não encontrado.</p>
          <p className="mt-3 text-[#0e302e]/70">O conteúdo pode ter sido removido ou o endereço está incorreto.</p>
          <Link
            to={cfg.backPath}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0e302e] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-white"
          >
            Voltar <ArrowLeft size={15} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fffdf8] px-6 py-16 lg:px-10 lg:py-24">
      <article className="mx-auto max-w-3xl">
        <Link
          to={cfg.backPath}
          className="inline-flex items-center gap-2 font-outfit text-[10px] font-bold uppercase tracking-[.16em] text-[#a07c3a]"
        >
          <ArrowLeft size={14} /> {cfg.backLabel}
        </Link>
        <p className="mt-6 font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">{cfg.label}</p>
        <h1 className="mt-4 font-fraunces text-6xl lg:text-8xl">{item.title}</h1>
        {item.excerpt && (
          <p className="mt-7 border-l-2 border-[#c7a45b] pl-5 text-xl leading-relaxed text-[#0e302e]/75">
            {item.excerpt}
          </p>
        )}
        <div className="mt-12">
          <RichText content={item.body} />
        </div>
        <aside className="my-14 rounded-[1.6rem] bg-[#0e302e] p-8 text-white">
          <p className="font-outfit text-[10px] font-bold uppercase tracking-[.18em] text-[#e2c88c]">Próximo passo</p>
          <h2 className="mt-3 font-fraunces text-3xl">Quer trazer este tema para a realidade da sua organização?</h2>
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

export const CasesPage = () => <ListView kind="cases" />;
export const CaseDetailPage = () => <DetailView kind="cases" />;
export const KnowledgePage = () => <ListView kind="conhecimentos" />;
export const KnowledgeDetailPage = () => <DetailView kind="conhecimentos" />;
