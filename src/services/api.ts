// Camada de acesso à API pública do Strapi (somente leitura, sem token).
export const API_URL = "https://backend.lucinariconsulting.com.br/api";
export const STRAPI_ORIGIN = "https://backend.lucinariconsulting.com.br";

export type StrapiTextNode = {
  type?: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

export type StrapiBlock = {
  type?: string;
  level?: number;
  format?: "ordered" | "unordered";
  children?: (StrapiTextNode | StrapiBlock)[];
  url?: string;
  alt?: string;
};

export type StrapiMedia = {
  url?: string;
  alternativeText?: string | null;
  name?: string;
  width?: number;
  height?: number;
  formats?: Record<string, { url?: string; width?: number; height?: number }>;
};

export type BlogPost = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: StrapiBlock[];
  published_date: string;
  cover: StrapiMedia | null;
};

export type GlossaryTerm = {
  id: number;
  documentId: string;
  term: string;
  slug: string;
  short_definition: string;
  definition: StrapiBlock[];
};

export type CompanyInfo = {
  id: number;
  documentId: string;
  companyName: string;
  mail: string | null;
  whatsapp: string | null;
  instagram: string | null;
  linkedin: string | null;
  facebookPage: string | null;
};

export type CaseStudy = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  description: StrapiBlock[];
  client: string | null;
  date: string | null;
  cover: StrapiMedia | null;
};

export type KnowledgeItem = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: StrapiBlock[];
  featured: boolean | null;
  published_date: string;
  cover: StrapiMedia | null;
};

type StrapiListResponse = {
  data: BlogPost[];
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
};

type StrapiGlossaryListResponse = {
  data: GlossaryTerm[];
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
};

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Não foi possível carregar os dados (${response.status}).`);
  }
  return (await response.json()) as T;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await request<StrapiListResponse>(`${API_URL}/blog-posts?populate=*`);
  return data.data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const data = await request<StrapiListResponse>(
    `${API_URL}/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
  );
  return data.data?.[0] ?? null;
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const data = await request<StrapiGlossaryListResponse>(`${API_URL}/glossaries?populate=*`);
  return data.data ?? [];
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | null> {
  const data = await request<StrapiGlossaryListResponse>(
    `${API_URL}/glossaries?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
  );
  return data.data?.[0] ?? null;
}

type StrapiCompanyInfoResponse = {
  data: CompanyInfo;
  meta?: unknown;
};

export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  const data = await request<StrapiCompanyInfoResponse>(`${API_URL}/company-info?populate=*`);
  return data.data ?? null;
}

type StrapiCaseListResponse = {
  data: CaseStudy[];
  meta?: unknown;
};

type StrapiKnowledgeListResponse = {
  data: KnowledgeItem[];
  meta?: unknown;
};

export async function getCases(): Promise<CaseStudy[]> {
  const data = await request<StrapiCaseListResponse>(`${API_URL}/cases?populate=*`);
  return data.data ?? [];
}

export async function getCaseBySlug(slug: string): Promise<CaseStudy | null> {
  const data = await request<StrapiCaseListResponse>(
    `${API_URL}/cases?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
  );
  return data.data?.[0] ?? null;
}

export async function getKnowledges(): Promise<KnowledgeItem[]> {
  const data = await request<StrapiKnowledgeListResponse>(`${API_URL}/knowledges?populate=*`);
  return data.data ?? [];
}

export async function getKnowledgeBySlug(slug: string): Promise<KnowledgeItem | null> {
  const data = await request<StrapiKnowledgeListResponse>(
    `${API_URL}/knowledges?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
  );
  return data.data?.[0] ?? null;
}

// O Strapi devolve caminhos relativos (/uploads/...). A origem dos arquivos é a
// raiz do backend, não a URL da API (que termina em /api).
export function buildMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${STRAPI_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
}
