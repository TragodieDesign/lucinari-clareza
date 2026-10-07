import { ArrowLeft, ArrowUpRight, ChevronRight, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import RichText from "@/components/RichText";
import { categories, contentItems, type ContentKind } from "@/lib/content";
import { getGlossaryTerms, getGlossaryTermBySlug, type GlossaryTerm } from "@/services/api";

const config: Record<ContentKind, { title: string; intro: string; label: string; keyword: string }> = {
  blog: { title: "Ideias para decidir com mais clareza.", intro: "Análises sobre governança corporativa, PMO estratégico, VMO, OKRs e gestão de portfólio.", label: "Blog", keyword: "insights em gestão estratégica" },
  conhecimento: { title: "Conhecimento aplicado à sua decisão.", intro: "Guias e materiais para transformar temas complexos em próximos passos concretos.", label: "Centro de Conhecimento", keyword: "guias de governança e PMO" },
  case: { title: "Conhecimento e transformações que geram valor.", intro: "Palestras, treinamentos e projetos que conectam estratégia, execução e valor.", label: "Cases", keyword: "palestras, treinamentos e cases de gestão" },
};
const setSeo = (title: string, description: string) => { document.title = `${title} | Lucinari Consulting`; const meta = document.querySelector('meta[name="description"]'); if (meta) meta.setAttribute("content", description); };

const renderBody = (paragraphs: string[]) => {
  const nodes: ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => { if (list.length) { nodes.push(<ul key={`ul-${nodes.length}`} className="space-y-3">{list.map((line) => <li key={line} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c7a45b]"/><span>{line}</span></li>)}</ul>); list = []; } };
  paragraphs.forEach((line, index) => {
    if (line.startsWith("## ")) { flushList(); nodes.push(<h2 key={index} className="pt-4 font-fraunces text-3xl text-[#0e302e]">{line.slice(3)}</h2>); }
    else if (line.startsWith("### ")) { flushList(); nodes.push(<h3 key={index} className="pt-3 font-fraunces text-2xl text-[#0e302e]">{line.slice(4)}</h3>); }
    else if (line.startsWith("- ")) { list.push(line.slice(2)); }
    else { flushList(); nodes.push(<p key={index}>{line}</p>); }
  });
  flushList();
  return nodes;
};

export const ArchivePage = ({ kind }: { kind: ContentKind }) => {
  const [category, setCategory] = useState("Todos"); const data = config[kind];
  useEffect(() => setSeo(data.label, data.intro), [data]);
  const items = contentItems.filter((item) => item.kind === kind && (category === "Todos" || item.category === category));
  const availableCategories = ["Todos", ...categories.filter((entry) => contentItems.some((item) => item.kind === kind && item.category === entry))];
  return <main className="bg-[#f3eee1] px-6 py-16 lg:px-10 lg:py-24"><div className="mx-auto max-w-7xl"><p className="font-outfit text-[11px] font-bold uppercase tracking-[.22em] text-[#a07c3a]">{data.label} · {data.keyword}</p><h1 className="mt-4 max-w-3xl font-fraunces text-5xl leading-[.98] lg:text-7xl">{data.title}</h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-[#0e302e]/70">{data.intro}</p>{kind === "blog" && <div className="mt-10 grid gap-4 rounded-[1.6rem] bg-[#0e302e] p-6 text-white md:grid-cols-[1fr_auto]"><div><p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#e2c88c]">Leitura de partida</p><p className="mt-2 font-fraunces text-2xl">Decidir melhor começa por tornar o essencial visível.</p></div><button onClick={() => window.dispatchEvent(new Event("open-lucinari-chat"))} className="rounded-full bg-[#c7a45b] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-[#0e302e]">Falar sobre seu contexto</button></div>}<div className="mt-10 flex flex-wrap gap-2">{availableCategories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 font-outfit text-[10px] font-bold uppercase tracking-wider ${category === item ? "bg-[#0e302e] text-white" : "border border-[#0e302e]/15 bg-white text-[#0e302e]"}`}>{item}</button>)}</div><div className="mt-12 grid gap-5 lg:grid-cols-3">{items.map((item) => <article key={item.slug} className="flex min-h-80 flex-col rounded-[1.6rem] border border-[#0e302e]/10 bg-[#fffdf8] p-6"><div className="flex justify-between font-outfit text-[10px] font-bold uppercase tracking-widest text-[#a07c3a]"><span>{item.category}</span><span>{item.readTime}</span></div><h2 className="mt-6 font-fraunces text-3xl leading-tight">{item.title}</h2><p className="mt-4 text-sm leading-relaxed text-[#0e302e]/70">{item.excerpt}</p><Link className="mt-auto flex items-center gap-2 pt-7 font-outfit text-xs font-bold uppercase tracking-wider" to={`/${kind === "case" ? "cases" : kind}/${item.slug}`}>Ler conteúdo <ArrowUpRight size={15}/></Link></article>)}</div></div></main>;
};

export const ArticlePage = () => { const { kind, slug } = useParams(); const normalizedKind = kind === "cases" ? "case" : kind; const item = contentItems.find((entry) => entry.kind === normalizedKind && entry.slug === slug); useEffect(() => { if (item) setSeo(item.title, item.excerpt); }, [item]); if (!item) return <main className="grid min-h-[60vh] place-items-center bg-[#f3eee1]"><Link to="/blog">Voltar para conteúdos</Link></main>; return <main className="bg-[#fffdf8] px-6 py-16 lg:px-10 lg:py-24"><article className="mx-auto max-w-3xl"><div className="flex justify-between font-outfit text-[10px] font-bold uppercase tracking-[.16em] text-[#a07c3a]"><span>{item.category}</span><span>{item.date} · {item.readTime}</span></div><h1 className="mt-5 font-fraunces text-5xl leading-[.98] lg:text-7xl">{item.title}</h1><p className="mt-7 border-l-2 border-[#c7a45b] pl-5 text-xl leading-relaxed text-[#0e302e]/75">{item.excerpt}</p><div className="mt-12 space-y-6 text-lg leading-relaxed text-[#0e302e]/80">{item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><aside className="my-14 rounded-[1.6rem] bg-[#0e302e] p-8 text-white"><p className="font-outfit text-[10px] font-bold uppercase tracking-[.18em] text-[#e2c88c]">Próximo passo</p><h2 className="mt-3 font-fraunces text-3xl">Quer trazer este tema para a realidade da sua organização?</h2><button onClick={() => window.dispatchEvent(new Event("open-lucinari-chat"))} className="mt-6 rounded-full bg-[#c7a45b] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-[#0e302e]">Falar com especialista</button></aside><h2 className="font-fraunces text-3xl">Perguntas frequentes</h2><div className="mt-5 divide-y divide-[#0e302e]/10">{item.faqs.map((faq) => <details key={faq.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between font-fraunces text-xl">{faq.question}<ChevronRight className="transition group-open:rotate-90" size={20}/></summary><p className="mt-3 max-w-2xl leading-relaxed text-[#0e302e]/70">{faq.answer}</p></details>)}</div></article></main>; };

export const GlossaryPage = () => {
  const [query, setQuery] = useState("");
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => setSeo("Glossário de gestão estratégica", "Conceitos de governança, PMO, VMO, OKRs e portfólio explicados com clareza."), []);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    getGlossaryTerms()
      .then((data) => {
        if (!active) return;
        setTerms(data);
        setStatus("success");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const filtered = useMemo(
    () => terms.filter((item) => item.term.toLowerCase().includes(query.toLowerCase()) || item.short_definition.toLowerCase().includes(query.toLowerCase())),
    [terms, query],
  );

  return <main className="bg-[#f3eee1] px-6 py-16 lg:px-10 lg:py-24"><div className="mx-auto max-w-5xl"><p className="font-outfit text-[11px] font-bold uppercase tracking-[.22em] text-[#a07c3a]">Taxonomia de conceitos</p><h1 className="mt-4 font-fraunces text-5xl lg:text-7xl">Glossário Lucinari</h1><p className="mt-5 max-w-xl text-lg text-[#0e302e]/70">Definições objetivas e leituras aprofundadas para apoiar conversas sobre estratégia, governança e entrega.</p><label className="relative mt-10 block max-w-lg"><Search className="absolute left-4 top-4 text-[#a07c3a]" size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar um conceito" className="w-full rounded-2xl border border-[#0e302e]/15 bg-white py-4 pl-11 pr-4 outline-none focus:border-[#c7a45b]"/></label>{status === "loading" && <div className="mt-10 grid min-h-56 place-items-center rounded-2xl border border-[#0e302e]/10 bg-white"><div className="flex flex-col items-center gap-3 text-[#0e302e]/60"><Loader2 className="animate-spin text-[#a07c3a]" size={24}/><p className="font-outfit text-xs font-bold uppercase tracking-wider">Carregando glossário…</p></div></div>}{status === "error" && <div className="mt-10 rounded-2xl border border-[#0e302e]/10 bg-white p-10 text-center"><p className="font-fraunces text-2xl">Não foi possível carregar o glossário.</p><p className="mt-3 text-[#0e302e]/70">Verifique sua conexão e tente novamente.</p><button onClick={() => setAttempt((n) => n + 1)} className="mt-6 rounded-full bg-[#0e302e] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-white">Tentar novamente</button></div>}{status === "success" && (filtered.length === 0 ? <div className="mt-10 rounded-2xl border border-[#0e302e]/10 bg-white p-10 text-center"><p className="font-fraunces text-2xl">Nenhum conceito encontrado.</p><p className="mt-3 text-[#0e302e]/70">Tente buscar por outro termo.</p></div> : <div className="mt-10 grid gap-4 md:grid-cols-2">{filtered.map((item) => <Link to={`/glossario/${item.slug}`} key={item.slug} className="rounded-2xl bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"><h2 className="font-fraunces text-2xl">{item.term}</h2><p className="mt-3 leading-relaxed text-[#0e302e]/70">{item.short_definition}</p><span className="mt-5 flex items-center gap-2 font-outfit text-xs font-bold uppercase tracking-wider">Ler conceito <ArrowUpRight size={14}/></span></Link>)}</div>)}</div></main>;
};

export const GlossaryTermPage = () => {
  const { slug } = useParams();
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "notfound" | "success">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setStatus("loading");
    getGlossaryTermBySlug(slug)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setTerm(null);
          setStatus("notfound");
          return;
        }
        setTerm(data);
        setStatus("success");
        setSeo(`${data.term}: definição`, data.short_definition);
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [slug, attempt]);

  if (status === "loading") return <main className="grid min-h-[60vh] place-items-center bg-[#fffdf8] px-6"><div className="flex flex-col items-center gap-3 text-[#0e302e]/60"><Loader2 className="animate-spin text-[#a07c3a]" size={26}/><p className="font-outfit text-xs font-bold uppercase tracking-wider">Carregando conceito…</p></div></main>;

  if (status === "error") return <main className="grid min-h-[60vh] place-items-center bg-[#fffdf8] px-6"><div className="text-center"><p className="font-fraunces text-3xl">Não foi possível carregar este conceito.</p><p className="mt-3 text-[#0e302e]/70">Verifique sua conexão e tente novamente.</p><button onClick={() => setAttempt((n) => n + 1)} className="mt-6 rounded-full bg-[#0e302e] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-white">Tentar novamente</button></div></main>;

  if (status === "notfound" || !term) return <main className="grid min-h-[60vh] place-items-center bg-[#fffdf8] px-6"><div className="text-center"><p className="font-fraunces text-3xl">Conceito não encontrado.</p><p className="mt-3 text-[#0e302e]/70">O termo pode ter sido removido ou o endereço está incorreto.</p><Link to="/glossario" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0e302e] px-5 py-3 font-outfit text-xs font-bold uppercase tracking-wider text-white">Voltar ao glossário <ArrowLeft size={15}/></Link></div></main>;

  return <main className="bg-[#fffdf8] px-6 py-16 lg:px-10 lg:py-24"><article className="mx-auto max-w-3xl"><Link to="/glossario" className="inline-flex items-center gap-2 font-outfit text-[10px] font-bold uppercase tracking-[.16em] text-[#a07c3a]"><ArrowLeft size={14}/> Glossário</Link><p className="mt-6 font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Glossário</p><h1 className="mt-4 font-fraunces text-6xl lg:text-8xl">{term.term}</h1><p className="mt-7 border-l-2 border-[#c7a45b] pl-5 text-xl leading-relaxed text-[#0e302e]/75">{term.short_definition}</p><div className="mt-12"><RichText content={term.definition} /></div></article></main>;
};
