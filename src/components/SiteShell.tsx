import { ChevronDown, Linkedin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanyInfo, type CompanyInfo } from "@/services/api";

export const Header = () => {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0e302e]/95 text-white backdrop-blur"><nav className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-5 lg:px-10"><Link to="/" className="flex items-center" aria-label="Lucinari Consulting — Página inicial"><img src="/assets/Lucinari-consulting-logo-horizontal-sem-fundo.png" alt="Lucinari Consulting" className="h-12 w-auto object-contain lg:h-16"/></Link><div className="hidden items-center gap-6 font-outfit text-[10px] font-semibold uppercase tracking-[.12em] text-white/75 lg:flex"><div className="group relative py-7"><span className="flex cursor-default items-center gap-1 text-white transition group-hover:text-[#e2c88c]">PRODUTOS <ChevronDown size={14} className="transition group-hover:rotate-180"/></span><div className="pointer-events-none absolute left-0 top-[67px] w-80 translate-y-2 rounded-2xl border border-white/10 bg-[#123c38] p-2 opacity-0 shadow-2xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"><p className="px-4 py-2 text-[9px] tracking-[.18em] text-[#e2c88c]">PRODUTOS & SERVIÇOS</p><Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/solucoes/governanca-gestao-projetos">Gestão de Projetos</Link><Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/solucoes/estruturacao-pmo-vmo">Escritório de Projetos (PMO / VMO)</Link><Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/solucoes/gestao-agil">Gestão Ágil</Link><Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/solucoes/educacao-executiva">Educação Executiva</Link></div></div><Link to="/sobre">Sobre</Link><Link to="/blog">Blog</Link><Link to="/conhecimentos">Conhecimentos</Link><Link to="/glossario">Glossário</Link><Link to="/cases">Cases</Link></div><button onClick={() => window.dispatchEvent(new Event("open-lucinari-chat"))} className="hidden rounded-full border border-[#c7a45b] px-4 py-2 font-outfit text-[10px] font-bold uppercase tracking-wider text-[#e2c88c] lg:block">Falar com especialista</button><button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menu">{open ? <X/> : <Menu/>}</button></nav>{open && <div className="border-t border-white/10 px-5 pb-5 text-center font-outfit text-xs uppercase tracking-wider lg:hidden"><Link className="block py-3" to="/solucoes/governanca-gestao-projetos">Produtos</Link><Link className="block py-3" to="/sobre">Sobre</Link><Link className="block py-3" to="/blog">Blog</Link><Link className="block py-3" to="/conhecimentos">Conhecimentos</Link><Link className="block py-3" to="/glossario">Glossário</Link><Link className="block py-3" to="/cases">Cases</Link></div>}</header>;
};

const formatWhatsApp = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 13) return value;
  return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 9)}-${digits.slice(9)}`;
};

export const Footer = () => {
  const [info, setInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    let active = true;
    getCompanyInfo()
      .then((data) => {
        if (active) setInfo(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const whatsapp = info?.whatsapp ?? null;
  const mail = info?.mail ?? null;
  const linkedin = info?.linkedin ?? null;

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#123c38] px-6 py-9 text-white lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 md:flex-row">
        <div>
          <p className="font-fraunces text-2xl">lucinari<span className="text-[#e2c88c]">.</span></p>
          <p className="mt-2 max-w-xs text-sm text-white/60">Método claro para decisões, cadência e entrega de valor.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm text-white/70">
          <div>
            <p className="mb-3 font-outfit text-[10px] font-bold uppercase tracking-widest text-[#e2c88c]">Conteúdo</p>
            <Link className="block py-1" to="/blog">Blog</Link>
            <Link className="block py-1" to="/conhecimentos">Conhecimentos</Link>
            <Link className="block py-1" to="/glossario">Glossário</Link>
            <Link className="block py-1" to="/cases">Cases</Link>
          </div>
          <div>
            <p className="mb-3 font-outfit text-[10px] font-bold uppercase tracking-widest text-[#e2c88c]">Contato</p>
            {whatsapp && (
              <a className="block py-1" href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}>
                {formatWhatsApp(whatsapp)}
              </a>
            )}
            {mail && (
              <a className="block py-1" href={`mailto:${mail}`}>E-mail</a>
            )}
            {linkedin && (
              <a className="flex items-center gap-2 py-1" href={linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={15} />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
