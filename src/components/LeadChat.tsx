import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Send, X } from "lucide-react";

type LeadData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  sourcePage: string;
};

const WHATSAPP_NUMBER = "5511994706023";
const WEBHOOK_URL = import.meta.env.PROD
  ? "https://lucinari-consulting-n8n.uar6l1.easypanel.host/webhook/533602a5-f703-4b2e-b44a-aaf124ddc9aa"
  : "https://lucinari-consulting-n8n.uar6l1.easypanel.host/webhook-test/533602a5-f703-4b2e-b44a-aaf124ddc9aa";

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  const local = digits.slice(2);
  const split = digits.length > 10 ? 5 : 4;
  return `(${digits.slice(0, 2)}) ${local.slice(0, split)}${local.length > split ? `-${local.slice(split)}` : ""}`;
};

const LeadChat = ({ contextualInterest }: { contextualInterest?: string }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [lead, setLead] = useState<LeadData>({ name: "", email: "", phone: "", company: "", interest: contextualInterest ?? "", sourcePage: window.location.href });
  const [complete, setComplete] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const submitted = useRef(false);

  useEffect(() => {
    if (contextualInterest) setLead((current) => ({ ...current, interest: contextualInterest }));
  }, [contextualInterest]);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("open-lucinari-chat", openChat);
    return () => window.removeEventListener("open-lucinari-chat", openChat);
  }, []);

  const questions = [
    { key: "name", text: "Olá. Para começar, como podemos chamar você?", placeholder: "Seu nome" },
    { key: "email", text: "Prazer, {name}. Qual é o seu melhor e-mail?", placeholder: "nome@empresa.com" },
    { key: "phone", text: "E qual número de WhatsApp usamos para continuar a conversa?", placeholder: "(00) 00000-0000" },
    { key: "company", text: "Em qual empresa você atua?", placeholder: "Nome da empresa" },
    { key: "interest", text: contextualInterest ? `Você chegou pela página “${contextualInterest}”. Confirma que este é o tema que quer conversar?` : "Qual tema mais precisa de clareza neste momento?", placeholder: contextualInterest ?? "Ex.: VMO, PMO, governança ou treinamento" },
  ] as const;

  const submit = (finalLead: LeadData) => {
    if (submitted.current) return;
    submitted.current = true;
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const code = `LUC-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
    const payload = { data: { ...finalLead, attendanceCode: code } };
    const text = `Olá, sou ${finalLead.name}, estou interessado em ${finalLead.interest}, e meu código de atendimento é ${code}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    setAttendanceCode(code);
    setWhatsappUrl(url);
    setComplete(true);
    // Abrir durante o clique evita o bloqueio de pop-ups após uma chamada assíncrona.
    window.open(url, "_blank", "noopener,noreferrer");

    void fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).then((response) => {
      if (!response.ok) console.warn(`O webhook n8n não recebeu o atendimento (${response.status}).`);
    }).catch(() => {
      console.warn("Não foi possível enviar o atendimento ao webhook n8n. Verifique a conexão e a configuração de CORS.");
    });
  };

  const advance = () => {
    if (submitted.current) return;
    const value = answer.trim();
    const key = questions[step].key;
    if (!value) {
      setError("Preencha este campo para continuar.");
      return;
    }
    if (key === "name" && (/\p{N}/u.test(value) || !/\p{L}/u.test(value))) {
      setError("Informe um nome sem números.");
      return;
    }
    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Informe um e-mail válido, como nome@empresa.com.");
      return;
    }
    if (key === "phone" && !/^[1-9]{2}(?:[2-5]\d{7}|9\d{8})$/.test(value.replace(/\D/g, ""))) {
      setError("Informe um telefone válido com DDD e 8 ou 9 dígitos.");
      return;
    }
    const nextLead = { ...lead, [key]: value };
    setLead(nextLead);
    setAnswer("");
    setError("");
    if (step === questions.length - 1) {
      submit({ ...nextLead, sourcePage: window.location.href });
      return;
    }
    setStep(step + 1);
  };

  const question = questions[step];
  const message = question.text.replace("{name}", lead.name || "");

  return (
    <div className="fixed bottom-5 right-5 z-50 font-plex">
      {open && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-[1.7rem] border border-[#c7a45b]/30 bg-[#0e302e] shadow-2xl shadow-[#0e302e]/40">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full border border-[#c7a45b] text-[#e2c88c]"><MessageCircle size={17} /></div><div><p className="font-outfit text-[10px] uppercase tracking-[.18em] text-[#e2c88c]">Lucinari Consulting</p><p className="text-xs text-white/70">Especialista online</p></div></div>
            <button aria-label="Fechar conversa" onClick={() => setOpen(false)} className="text-white/70 hover:text-white"><X size={19} /></button>
          </div>
          <div className="min-h-56 p-5">
            {complete ? (
              <div className="rounded-2xl bg-[#1e514a] p-4 text-sm leading-relaxed text-white">
                <p>Obrigada. Continue a conversa pelo WhatsApp com seu código de atendimento:</p>
                <p className="mt-3 break-all font-mono text-[#e2c88c]">{attendanceCode}</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-xl bg-[#c7a45b] px-4 py-3 font-outfit text-xs font-semibold text-[#0e302e]">Continuar no WhatsApp</a>
              </div>
            ) : (
              <>
                <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[#1e514a] p-4 text-sm leading-relaxed text-white">{message}</div>
                <form className="mt-4" noValidate onSubmit={(event) => { event.preventDefault(); advance(); }}>
                  <input
                    autoFocus
                    aria-label={question.placeholder}
                    aria-invalid={!!error}
                    aria-describedby={error ? "lead-chat-error" : undefined}
                    type={question.key === "email" ? "email" : question.key === "phone" ? "tel" : "text"}
                    autoComplete={question.key === "name" ? "name" : question.key === "email" ? "email" : question.key === "phone" ? "tel-national" : question.key === "company" ? "organization" : "off"}
                    value={answer}
                    onChange={(event) => { setAnswer(question.key === "phone" ? formatPhone(event.target.value) : event.target.value); setError(""); }}
                    placeholder={question.placeholder}
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#c7a45b]"
                  />
                  {error && <p id="lead-chat-error" role="alert" className="mt-2 text-xs text-red-200">{error}</p>}
                  <button type="submit" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c7a45b] px-4 py-3 font-outfit text-xs font-semibold uppercase tracking-wider text-[#0e302e] transition hover:bg-[#e2c88c]">Continuar <Send size={14} /></button>
                </form>
                <p className="mt-3 text-center text-[10px] text-white/60">Etapa {step + 1} de {questions.length}</p>
              </>
            )}
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="group flex items-center gap-3 rounded-full bg-[#c7a45b] py-3 pl-4 pr-5 font-outfit text-xs font-semibold uppercase tracking-[.12em] text-[#0e302e] shadow-xl transition hover:bg-[#e2c88c]">
        {open ? <X size={18} /> : <MessageCircle size={18} />} <span className="hidden sm:block">Fale com um especialista</span><ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
      </button>
    </div>
  );
};

export default LeadChat;
