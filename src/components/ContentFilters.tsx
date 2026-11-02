import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ContentSort } from "@/lib/content-order";

const labels: Record<ContentSort, string> = {
  priority: "Prioridade",
  newest: "Mais recentes",
  oldest: "Mais antigos",
  alphabetical: "Ordem alfabética (A–Z)",
};

const ContentFilters = ({ query, onQueryChange, sort, onSortChange, options, count }: {
  query: string;
  onQueryChange: (value: string) => void;
  sort: ContentSort;
  onSortChange: (value: ContentSort) => void;
  options: ContentSort[];
  count: number;
}) => (
  <div className="mt-10 rounded-2xl border border-[#0e302e]/10 bg-[#fffdf8] p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <label className="block flex-1">
        <span className="mb-2 block font-outfit text-[10px] font-bold uppercase tracking-wider text-[#a07c3a]">Buscar conteúdo</span>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-[#a07c3a]" size={17} />
          <Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Digite um título ou assunto" className="h-11 rounded-xl border-[#0e302e]/15 bg-white pl-11 text-[#0e302e] placeholder:text-[#0e302e]/55 focus-visible:ring-[#c7a45b]" />
        </div>
      </label>
      <div className="w-full sm:w-64">
        <span className="mb-2 block font-outfit text-[10px] font-bold uppercase tracking-wider text-[#a07c3a]">Ordenar por</span>
        <Select value={sort} onValueChange={(value) => onSortChange(value as ContentSort)}>
          <SelectTrigger aria-label="Ordenar conteúdos" className="h-11 rounded-xl border-[#0e302e]/15 bg-white text-[#0e302e] focus:ring-[#c7a45b]"><SelectValue /></SelectTrigger>
          <SelectContent className="rounded-xl border-[#0e302e]/15 bg-[#fffdf8] text-[#0e302e]">
            {options.map((option) => <SelectItem key={option} value={option} className="rounded-lg py-2 focus:bg-[#f3eee1] focus:text-[#0e302e]">{labels[option]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
    <p aria-live="polite" className="mt-3 text-xs text-[#0e302e]/70">{count} {count === 1 ? "resultado" : "resultados"}</p>
  </div>
);

export default ContentFilters;
