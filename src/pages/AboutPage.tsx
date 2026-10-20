import { ArrowUpRight, Award, GraduationCap, Mic2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const talks = [
  { title: "Gestão de Projetos e Metodologia Ágil na Prática", place: "FIA", type: "Palestra", slug: "palestra-gestao-projetos-agil-pratica-fia" },
  { title: "Gestão de Projetos e Agilidade", place: "SENAC", type: "Palestra", slug: "palestra-gestao-projetos-agilidade-senac" },
  { title: "Aprendizagem Baseada em Projetos", place: "17º Seminário Internacional de Gerenciamento de Projetos · PMI", type: "Palestra", slug: "palestra-aprendizagem-baseada-projetos-pmi" },
  { title: "Competências de Colaboração e Comunicação em Projetos", place: "Universidia", type: "Palestra", slug: "palestra-competencias-colaboracao-comunicacao-projetos" },
  { title: "Curso preparatório para Certificação em Gestão de Projetos", place: "PMI-SP", type: "Treinamento", slug: "treinamento-certificacao-gestao-projetos-pmi-sp" },
  { title: "Gestão de Projetos e Metodologia Ágil para equipes", place: "Banco Itaú, Bradesco e Moove", type: "Treinamento", slug: "treinamento-gestao-projetos-agil-equipes" },
];

const academic = [
  "Mestrado em Administração de Empresas · Mackenzie (em andamento)",
  "Pós-graduação em Gestão de Projetos · HSM/UNA",
  "MBA em Gestão de Negócios e Tecnologia · IPT / USP",
];

const professional = [
  "Project Management Professional (PMP) · PMI",
  "Scrum Master · International Scrum Institute",
  "Design Thinking Professional Certificate (DTPC) · CertiProf Professional Knowledge",
  "OKR Certified Professional (OKRCP) · CertiProf Professional Knowledge",
  "Professional Agile Coach Certified (PACC) · Agile Institute Brazil",
  "VMO Foundation · Formação VMO Expert",
  "Cloud & DevOps: Transformação Contínua · MIT Professional Education",
];

const AboutPage = () => {
  useEffect(() => { document.title = "Sobre a Lucinari Consulting | Gestão, VMO e PMO"; }, []);

  return (
    <main className="bg-[#f3eee1] text-[#0e302e]">
      <section className="bg-[#0e302e] px-6 py-20 text-white lg:px-10 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div>
            <p className="font-outfit text-[11px] font-bold uppercase tracking-[.22em] text-[#e2c88c]">Sobre a Lucinari</p>
            <h1 className="mt-5 font-fraunces text-5xl leading-[.96] lg:text-7xl">Estratégia só ganha força quando encontra <em className="font-normal text-[#e2c88c]">entrega.</em></h1>
            <p className="mt-7 text-lg leading-relaxed text-white/72">A Lucinari Consulting é uma consultoria e instituição de educação executiva especializada em estruturar a governança e alinhar os níveis estratégico, tático e operacional das organizações.</p>
            <p className="mt-4 text-lg leading-relaxed text-white/72">Apoiamos empresas em diferentes estágios de maturidade a organizar seus processos, estruturar escritórios de projetos (PMO/VMO), adotar práticas ágeis e capacitar lideranças, garantindo que os resultados alcançados no dia a dia sejam exatamente aqueles planejados pelo negócio.</p>
          </div>
          <blockquote className="mt-10">
            <p className="font-fraunces text-3xl leading-tight text-[#e2c88c]">“Da estratégia à entrega, com o fundo à vista.”</p>
            <p className="mt-4 text-sm leading-relaxed text-white/65">Consultoria séria não decide pelo cliente. Ela revela o que precisa estar visível para que a decisão certa aconteça.</p>
          </blockquote>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">A atuação</p>
            <h2 className="mt-4 font-fraunces text-4xl leading-tight">Método, disciplina e governança para transformar iniciativas em resultados.</h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-[#0e302e]/75">
            <p>A Lucinari nasceu para apoiar organizações que precisam alinhar prioridades, transformar decisões em cadência e tornar o valor da execução visível.</p>
            <p>A atuação combina consultoria estratégica e educação aplicada.</p>
            <p>Ajudamos empresas a sair da sobrecarga operacional por meio de um sistema claro de priorização, acompanhamento e entrega de valor.</p>
            <p>Unimos diagnóstico prático, desenho de processos (PMO/VMO e Agilidade) e capacitação executiva. Criamos modelos funcionais que respeitam o momento da sua empresa e fortalecem a tomada de decisão em todos os níveis hierárquicos. O resultado é uma operação mais fluida, lideranças preparadas e metas estratégicas que se concretizam no prazo planejado.</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div className="overflow-hidden rounded-[1.8rem] bg-[#0e302e]">
            <img src="/assets/MargarethLucinari.jpeg" alt="Margareth Lucinari, fundadora da Lucinari Consulting" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Perfil da fundadora</p>
            <h2 className="mt-3 font-fraunces text-4xl">Margareth Lucinari</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-[#0e302e]/75">
              <p>À frente da Lucinari Consulting, Margareth Lucinari combina mais de 30 anos de experiência corporativa em Tecnologia da Informação e mais de 15 anos em gestão estratégica, com experiência no setor financeiro e bancário.</p>
              <p>Especialista em Governança, PMO/VMO, Gestão de Projetos, Métodos Ágeis e Estratégia Corporativa, atua como consultora, mentora e professora de educação executiva e acadêmica, traduzindo conceitos avançados de gestão em soluções pragmáticas de alto impacto para empresas e lideranças.</p>
              <p>Mestranda em Administração e certificada nas principais disciplinas de gestão (PMP, Scrum, Agile Coaching, OKR, ITIL).</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Palestras & Treinamentos</p>
              <h2 className="mt-3 font-fraunces text-4xl">Conhecimento em diálogo com o mercado.</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#0e302e]/70">Temas estratégicos apresentados em grandes eventos do setor, instituições de ensino e treinamentos in-company.</p>
            </div>
            <Mic2 className="hidden text-[#a07c3a] md:block" size={34} />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {talks.map((item, index) => (
              <Link key={item.slug} to={`/cases/${item.slug}`} className="group rounded-2xl border border-[#0e302e]/10 bg-white p-6 transition hover:border-[#c7a45b] hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#a07c3a]">{item.type}</p>
                  <span className="font-outfit text-xs text-[#a07c3a]">0{index + 1}</span>
                </div>
                <h3 className="mt-5 font-fraunces text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm text-[#0e302e]/65">{item.place}</p>
                <span className="mt-6 flex items-center gap-2 font-outfit text-xs font-bold uppercase tracking-wider text-[#a07c3a]">Ver case <ArrowUpRight size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <GraduationCap className="text-[#a07c3a]" size={26} />
          <p className="mt-6 font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Formação acadêmica</p>
          <h2 className="mt-3 font-fraunces text-4xl">Fundamento para a prática.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {academic.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-[#0e302e]/10 bg-[#fffdf8] p-5">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#c7a45b]" />
                <p className="leading-relaxed text-[#0e302e]/75">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1e514a] px-6 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Award className="text-[#e2c88c]" size={26} />
          <p className="mt-6 font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#e2c88c]">Certificações profissionais</p>
          <h2 className="mt-3 max-w-2xl font-fraunces text-4xl">Repertório para conduzir transformações com profundidade.</h2>
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {professional.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-2xl border border-white/15 p-5">
                <span className="font-outfit text-xs text-[#e2c88c]">0{index + 1}</span>
                <p className="leading-relaxed text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center lg:px-10">
        <p className="font-outfit text-[11px] font-bold uppercase tracking-[.2em] text-[#a07c3a]">Vamos conversar</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-fraunces text-4xl">Seu contexto merece uma rota clara.</h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[#0e302e]/70">Conte sobre o desafio que está na sua frente. A partir dele, encontramos o próximo passo mais útil.</p>
        <button onClick={() => window.dispatchEvent(new Event("open-lucinari-chat"))} className="mt-8 rounded-full bg-[#0e302e] px-6 py-3.5 font-outfit text-xs font-bold uppercase tracking-wider text-white">Falar com especialista</button>
      </section>
    </main>
  );
};

export default AboutPage;
