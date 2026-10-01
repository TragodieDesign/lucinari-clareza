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

type StrapiListResponse = {
  data: BlogPost[];
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
};

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Não foi possível carregar os dados do blog (${response.status}).`);
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

// O Strapi devolve caminhos relativos (/uploads/...). A origem dos arquivos é a
// raiz do backend, não a URL da API (que termina em /api).
export function buildMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${STRAPI_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
}
