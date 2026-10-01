import { ArrowRight, ArrowUpRight, Compass, Layers3, Target } from "lucide-react";
import { Link } from "react-router-dom";
import BrandImage from "@/components/BrandImage";

const solutions = [
  { title: "Gestão de Projetos", text: "O carro-chefe da Lucinari: visão executiva conectada à execução tática com previsibilidade e dados.", image: "/assets/governanca-pmo.png", path: "/solucoes/governanca-gestao-projetos", result: "Decisões claras, entrega previsível." },
  { title: "Escritório de Projetos (PMO / VMO)", text: "Um centro gerador e mensurador de valor para a gestão de projetos.", image: "/assets/vmo-valor.png", path: "/solucoes/estruturacao-pmo-vmo", result: "Projetos que medem valor." },
  { title: "Gestão Ágil", text: "Mais velocidade de resposta ao negócio e menos retrabalho.", image: "/assets/Margareth_Consulting_Agile.png", path: "/solucoes/gestao-agil", result: "Times mais rápidos e focados." },
  { title: "Educação Executiva", text: "Competências de times e lideranças para sustentar a mudança com autonomia.", image: "/assets/educacao-executiva.png", path: "/solucoes/educacao-executiva", result: "Capacidade que permanece." },
];

const painPoints = ["Falta de visibilidade e dados confiáveis para a tomada de decisão executiva.", "O portfólio cresce, mas a capacidade real de entrega não acompanha.", "A estratégia corporativa muda, mas as iniciativas continuam presas à rota antiga.", "Projetos são finalizados, mas o retorno real (valor) não se concretiza."];

const whyItems = [
  { title: "Soluções sob medida para a sua maturidade", text: "Não aplicamos metodologias engessadas ou frameworks da moda apenas por protocolo. Diagnosticamos o momento operacional e a cultura da sua organização para desenhar a estrutura de governança e agilidade exata que o seu negócio consegue absorver e sustentar." },
  { title: "Pragmatismo com foco em Valor Real", text: "Não adicionamos camadas desnecessárias de burocracia nem relatórios que ninguém lê. Nossa atuação direciona esforços para o que gera impacto financeiro, eficiência de fluxo e alcance dos objetivos estratégicos." },
  { title: "Transferência contínua de conhecimento e autonomia", text: "Atuamos lado a lado com as lideranças e equipes por meio de educação executiva, sustentação prática e capacitação contínua para que os resultados permaneçam após a nossa entrega." },
  { title: "Visibilidade executiva e decisões baseadas em dados", text: "Transformamos dados dispersos em informações transparentes e indicadores acionáveis, dando clareza em tempo real para o board e segurança para os times de execução." },
];

const openChat = () => window.dispatchEvent(new Event("open-lucinari-chat"));

const Index = () => (
  <main className="bg-[#f3eee1] text-[#0e302e]">
    <section className="relative overflow-hidden bg-[#0e302e] text-white">
      <img
        src="/assets/lucinari-home-hero.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#0e302e]/60" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-6 pb-20 pt-36 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-outfit text-[11px] font-bold uppercase tracking-[.22em] text-[#e2c88c]">Gestão de Projetos · Gestão Ágil · Governança · PMO</p>
          <h1 className="mt-5 font-fraunces text-6xl leading-[.94] text-white lg:text-8xl">Da estratégia<br />à <em className="font-normal text-[#e2c88c]">entrega</em>:</h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">Transformando planos complexos em resultados previsíveis.</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">Consultoria especializada em gestão de projetos, governança pragmática, estruturação de PMO/VMO e metodologias ágeis para acelerar o valor do seu negócio.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={openChat} className="rounded-full bg-[#c7a45b] px-6 py-3.5 font-outfit text-xs font-bold uppercase tracking-wider text-[#0e302e]">Falar com especialista</button>
            <a href="#solucoes" className="rounded-full border border-white/35 px-6 py-3.5 font-outfit text-xs font-bold uppercase tracking-wider text-white">Conhecer soluções</a>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-[#0e302e]/10 px-6 py-16 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_2fr]">
        <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Nosso papel</p>
        <div>
          <p className="font-fraunces text-3xl leading-tight lg:text-4xl">Conectar a visão da diretoria à realidade dos times de execução e <em className="font-normal">construir a capacidade interna</em> para a sua empresa executar com excelência.</p>
          <p className="mt-5 max-w-2xl leading-relaxed text-[#0e302e]/70">Nosso compromisso é desenhar estruturas funcionais (PMO/VMO), implementar métodos ágeis sob medida e desenvolver competências executivas para que sua organização entregue projetos no prazo, gerando valor real e autonomia sustentável após a consultoria.</p>
        </div>
      </div>
    </section>

    <section className="bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Sinais de que é hora de agir</p>
            <h2 className="mt-4 font-fraunces text-4xl leading-tight">A complexidade não precisa comprometer seus resultados.</h2>
            <p className="mt-5 leading-relaxed text-[#0e302e]/70">Quando os sinais abaixo se repetem, não falta esforço: falta um sistema claro para priorizar, executar e acompanhar o que importa.</p>
            <button onClick={openChat} className="mt-7 flex items-center gap-2 font-outfit text-xs font-bold uppercase tracking-wider">Conversar sobre seu contexto <ArrowRight size={15} /></button>
          </div>
          <div className="grid gap-3">
            {painPoints.map((item, index) => (
              <button onClick={openChat} key={item} className="group flex items-start gap-4 rounded-2xl border border-[#0e302e]/10 p-5 text-left transition hover:border-[#c7a45b] hover:shadow-md">
                <span className="font-outfit text-xs text-[#a07c3a]">0{index + 1}</span>
                <p className="font-fraunces text-xl leading-snug">{item}</p>
                <ArrowUpRight className="ml-auto shrink-0 text-[#a07c3a]" size={17} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section id="solucoes" className="bg-[#0e302e] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#e2c88c]">Produtos e serviços</p>
        <h2 className="mt-3 max-w-2xl font-fraunces text-4xl text-white lg:text-5xl">Estrutura para <em className="font-normal">entregar valor.</em></h2>
        <p className="mt-5 max-w-xl text-white/65">Cada frente combina um diagnóstico do contexto, um desenho de atuação viável e uma cadência para que o método se sustente.</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((item) => (
            <Link key={item.title} to={item.path} className="group overflow-hidden rounded-[1.8rem] bg-[#123c38]">
              <BrandImage src={item.image} alt="" className="h-52 w-full" imgClassName="transition duration-500 group-hover:scale-105" icon={<Layers3 className="h-7 w-7" />} label={item.title} tone="mid" />
              <div className="p-6">
                <p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#e2c88c]">{item.result}</p>
                <h3 className="mt-3 font-fraunces text-2xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-white/65">{item.text}</p>
                <span className="mt-6 flex items-center gap-2 font-outfit text-xs font-bold uppercase tracking-wider text-[#e2c88c]">Explorar serviço <ArrowUpRight size={15} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Como a transformação acontece</p>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {[[Compass, "1. Diagnosticar", "Lemos o contexto para tornar visíveis decisões, bloqueios e prioridades."], [Layers3, "2. Estruturar e Implementar", "Desenhamos governança, ritos e informações que ajudam a liderança a agir."], [Target, "3. Sustentar", "Transferimos método e capacidade para que a evolução continue na operação."]].map(([Icon, title, text]) => {
            const I = Icon as typeof Compass;
            return <div key={title as string} className="rounded-2xl bg-white p-7 shadow-sm"><I className="text-[#a07c3a]" /><h3 className="mt-7 font-fraunces text-2xl">{title as string}</h3><p className="mt-3 leading-relaxed text-[#0e302e]/70">{text as string}</p></div>;
          })}
        </div>
      </div>
    </section>

    <section className="bg-[#1e514a] px-6 py-20 text-white lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#e2c88c]">Por que a Lucinari?</p>
        <h2 className="mt-4 max-w-3xl font-fraunces text-4xl leading-tight lg:text-5xl">Rigor técnico, governança pragmática e transferência de conhecimento para gerar <em className="font-normal text-[#e2c88c]">valor sustentável</em> ao seu negócio.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {whyItems.map((item, index) => (
            <div key={item.title} className="rounded-2xl bg-white/5 p-7 ring-1 ring-white/10">
              <span className="font-outfit text-xs font-bold text-[#e2c88c]">0{index + 1}</span>
              <h3 className="mt-4 font-fraunces text-2xl">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-white/75">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="px-6 py-20 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        <Link to="/blog" className="rounded-2xl bg-white p-6 shadow-sm"><p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#a07c3a]">Blog</p><h3 className="mt-5 font-fraunces text-2xl">Ideias que organizam decisões.</h3></Link>
        <Link to="/conhecimentos" className="rounded-2xl bg-white p-6 shadow-sm"><p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#a07c3a]">Conhecimentos</p><h3 className="mt-5 font-fraunces text-2xl">Guias para avançar com método.</h3></Link>
        <Link to="/cases" className="rounded-2xl bg-white p-6 shadow-sm"><p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#a07c3a]">Cases</p><h3 className="mt-5 font-fraunces text-2xl">Transformações que geraram clareza.</h3></Link>
      </div>
    </section>

    <section className="bg-[#0e302e] px-6 py-20 text-center text-white lg:px-10">
      <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#e2c88c]">Próximo passo</p>
      <h2 className="mx-auto mt-4 max-w-2xl font-fraunces text-4xl">Vamos revelar o que está impedindo a sua entrega de avançar?</h2>
      <p className="mx-auto mt-5 max-w-xl text-white/65">Comece uma conversa breve. Entendemos seu desafio e indicamos o próximo passo mais útil.</p>
      <button onClick={openChat} className="mt-8 rounded-full bg-[#c7a45b] px-6 py-3.5 font-outfit text-xs font-bold uppercase tracking-wider text-[#0e302e]">Falar com especialista</button>
    </section>
  </main>
);

export default Index;
