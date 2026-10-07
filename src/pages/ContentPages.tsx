import { ArrowLeft, ArrowUpRight, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RichText from "@/components/RichText";
import { getGlossaryTerms, getGlossaryTermBySlug, type GlossaryTerm } from "@/services/api";

const setSeo = (title: string, description: string) => { document.title = `${title} | Lucinari Consulting`; const meta = document.querySelector('meta[name="description"]'); if (meta) meta.setAttribute("content", description); };

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
