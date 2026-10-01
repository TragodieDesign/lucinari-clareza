import { ArrowUpRight, Check, ChevronRight, Layers3, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import BrandImage from "@/components/BrandImage";

type PageData = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  outcome: string;
  points: string[];
  approach: string[];
  audience: string[];
  related: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

const baseFaqs = [
  {
    q: "Como começa a atuação?",
    a: "Começamos por uma conversa de contexto e um diagnóstico proporcional ao desafio. A partir daí, desenhamos uma proposta de trabalho com objetivos, etapas e entregas claras.",
  },
  {
    q: "A solução substitui as equipes internas?",
    a: "Não. A Lucinari trabalha junto das lideranças e dos times para estruturar método, acelerar decisões e deixar capacidade instalada na organização.",
  },
];

const approach = [
  "Revelamos o contexto e o que impede a entrega de avançar.",
  "Estruturamos modelo, ritos e informações que ajudam a liderança a agir.",
  "Acompanhamos até que o método se sustente com autonomia.",
];

const pages: Record<string, PageData> = {
  "governanca-gestao-projetos": {
    eyebrow: "Pilar 01",
    title: "Gestão de Projetos",
    intro: "O carro-chefe da Lucinari: conectando a visão executiva à execução tática com previsibilidade e dados.",
    image: "/assets/governanca-pmo.png",
    outcome: "Decisões com direção clara e um portfólio que entrega com previsibilidade.",
    points: [
      "Alinhamento e priorização estratégica de portfólio",
      "Estruturação de processos e rituais de governança pragmáticos (sem burocracia)",
      "Implantação de métricas de saúde, riscos e dashboards executivos em tempo real",
      "Diagnóstico de maturidade e plano de evolução metodológica",
      "Definição e gestão dos OKRs",
    ],
    approach,
    audience: [
      "Executivos que precisam conectar estratégia, projetos e resultados com previsibilidade.",
      "PMOs e gestores de portfólio que desejam ritos leves e úteis.",
      "Organizações que precisam priorizar melhor e decidir com dados.",
    ],
    related: [
      {
        title: "Estratégia distante da execução",
        text: "Quando prioridades não chegam com clareza aos projetos e às equipes.",
      },
      {
        title: "Portfólio sem priorização clara",
        text: "Quando iniciativas competem por recursos sem critérios explícitos de escolha.",
      },
    ],
    faqs: baseFaqs,
  },
  "estruturacao-pmo-vmo": {
    eyebrow: "Pilar 02",
    title: "Estruturação e Otimização de PMO / VMO",
    intro: "Evoluindo a gestão de projetos para um centro gerador e mensurador de valor.",
    image: "/assets/vmo-valor.png",
    outcome: "Um escritório de projetos que passa a medir e ampliar valor, não só controlar entregas.",
    points: [
      "Implantação e reestruturação de PMOs (Estratégico, Tático ou Operacional)",
      "Transição de PMO tradicional para VMO (Value Management Office)",
      "Padronização de processos e templates e adequação das metodologias",
    ],
    approach,
    audience: [
      "Organizações que querem implantar ou reestruturar um PMO com propósito claro.",
      "PMOs que precisam evoluir para uma atuação orientada a valor.",
      "Lideranças que desejam medir benefícios e impacto das iniciativas.",
    ],
    related: [
      {
        title: "PMO focado em reporte, não em valor",
        text: "Quando o escritório acompanha status, mas não contribui para decisões de valor.",
      },
      {
        title: "Processos pesados e baixa aderência",
        text: "Quando templates e ritos existem, mas não se encaixam na realidade dos times.",
      },
    ],
    faqs: baseFaqs,
  },
  "gestao-agil": {
    eyebrow: "Pilar 03",
    title: "Gestão Ágil & Transformação",
    intro: "Acelerando a velocidade de resposta ao negócio e reduzindo o retrabalho.",
    image: "/assets/Margareth_Consulting_Agile.png",
    outcome: "Times que respondem mais rápido ao negócio, com menos retrabalho e mais foco.",
    points: [
      "Implementação personalizada de frameworks ágeis (Scrum, Kanban, Lean)",
      "Agilidade integrada além da TI (áreas de negócio, operações e liderança)",
      "Acompanhamento contínuo para sustentação cultural",
      "Modelos híbridos de gestão adaptados à realidade e criticidade de cada projeto",
    ],
    approach,
    audience: [
      "Lideranças e equipes que precisam de maior velocidade de resposta ao negócio.",
      "Organizações que querem levar a agilidade além da TI.",
      "Times com retrabalho, prioridades conflitantes ou ciclos longos de entrega.",
    ],
    related: [
      {
        title: "Agilidade limitada à TI",
        text: "Quando as práticas ágeis não alcançam negócio, operações e liderança.",
      },
      {
        title: "Retrabalho e ciclos longos",
        text: "Quando falta fluxo claro entre prioridade, execução e aprendizado.",
      },
    ],
    faqs: baseFaqs,
  },
  "educacao-executiva": {
    eyebrow: "Pilar 04",
    title: "Educação Executiva & Capacitação Corporativa",
    intro: "Desenvolvendo competências dos times e as lideranças para sustentar a mudança com autonomia.",
    image: "/assets/educacao-executiva.png",
    outcome: "Capacidade instalada para sustentar a transformação com autonomia.",
    points: [
      "Treinamentos práticos de gestão de projetos, metodologia ágil e estratégia por OKRs",
      "Desenvolvimento de liderança ágil, cultura de valor e colaboração",
      "Workshops executivos in-company aplicados a desafios reais da empresa",
    ],
    approach,
    audience: [
      "Lideranças que precisam alinhar linguagem, método e tomada de decisão.",
      "Times e PMOs que desejam aumentar a maturidade de execução.",
      "Organizações em transformação que precisam transformar conhecimento em rotina.",
    ],
    related: [
      {
        title: "Conhecimento sem aplicação prática",
        text: "Quando treinamentos não se conectam aos desafios reais do negócio.",
      },
      {
        title: "Mudança que não se sustenta",
        text: "Quando a capacidade não permanece após o projeto.",
      },
    ],
    faqs: baseFaqs,
  },
};

const openChat = () => window.dispatchEvent(new Event("open-lucinari-chat"));

const DetailPage = () => {
  const { slug } = useParams();
  const page = slug ? pages[slug] : undefined;

  useEffect(() => {
    if (page) document.title = `${page.title} | Lucinari Consulting`;
  }, [page]);

  if (!page)
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#f3eee1]">
        <Link to="/">Voltar ao início</Link>
      </main>
    );

  return (
    <main className="bg-[#f3eee1]">
      <section className="bg-[#0e302e] px-6 py-20 text-white lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#e2c88c]">
              Serviço · {page.eyebrow}
            </p>
            <h1 className="mt-5 font-fraunces text-5xl leading-[.96] lg:text-7xl">{page.title}</h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">{page.intro}</p>
            <button
              onClick={openChat}
              className="mt-8 rounded-full bg-[#c7a45b] px-6 py-3.5 font-outfit text-xs font-bold uppercase tracking-wider text-[#0e302e]"
            >
              Falar com especialista
            </button>
          </div>
          <BrandImage src={page.image} alt="" className="aspect-[4/3] rounded-[1.8rem]" icon={<Layers3 className="h-8 w-8" />} label={page.title} tone="mid" />
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">O que fazemos</p>
            <h2 className="mt-4 font-fraunces text-4xl">{page.outcome}</h2>
            <p className="mt-5 max-w-md leading-relaxed text-[#0e302e]/70">
              A atuação combina diagnóstico, desenho do modelo e uma cadência que transforma decisão em rotina de trabalho.
            </p>
          </div>
          <div className="grid gap-3">
            {page.points.map((item, i) => (
              <div className="flex items-center gap-4 rounded-2xl bg-white p-5" key={item}>
                <span className="font-outfit text-[#a07c3a]">0{i + 1}</span>
                <p className="font-fraunces text-xl">{item}</p>
                <Check className="ml-auto text-[#a07c3a]" size={18} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Como trabalhamos</p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {page.approach.map((item, index) => (
              <div key={item} className="rounded-2xl border border-[#0e302e]/10 p-6">
                <span className="font-outfit text-xs text-[#a07c3a]">0{index + 1}</span>
                <p className="mt-6 font-fraunces text-2xl">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Para quem faz sentido</p>
            <h2 className="mt-4 font-fraunces text-4xl">O método precisa caber na sua realidade.</h2>
          </div>
          <div className="space-y-4">
            {page.audience.map((item) => (
              <p className="flex gap-3 leading-relaxed" key={item}>
                <ShieldCheck className="mt-1 shrink-0 text-[#a07c3a]" size={18} />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1e514a] px-6 py-16 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#e2c88c]">
            Desafios que este serviço resolve
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {page.related.map((item) => (
              <button
                key={item.title}
                onClick={openChat}
                className="group flex items-start gap-4 rounded-2xl border border-white/15 p-5 text-left transition hover:bg-white/10"
              >
                <Layers3 className="mt-1 text-[#e2c88c]" />
                <div>
                  <h3 className="font-fraunces text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{item.text}</p>
                </div>
                <ChevronRight className="ml-auto mt-1 text-[#e2c88c]" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf8] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Perguntas frequentes</p>
          <div className="mt-5 divide-y divide-[#0e302e]/10">
            {page.faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-fraunces text-xl">
                  {faq.q}
                  <ChevronRight className="transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-[#0e302e]/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center lg:px-10">
        <h2 className="font-fraunces text-4xl">Vamos revelar o próximo passo?</h2>
        <button
          onClick={openChat}
          className="mt-6 rounded-full bg-[#0e302e] px-6 py-3.5 font-outfit text-xs font-bold uppercase tracking-wider text-white"
        >
          Conversar sobre este contexto <ArrowUpRight className="ml-1 inline" size={15} />
        </button>
      </section>
    </main>
  );
};

export default DetailPage;
