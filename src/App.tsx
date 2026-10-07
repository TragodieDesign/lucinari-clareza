import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LeadChat from "@/components/LeadChat";
import ScrollToTop from "@/components/ScrollToTop";
import { Footer, Header } from "@/components/SiteShell";
import { GlossaryPage, GlossaryTermPage } from "./pages/ContentPages";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import { CasesPage, CaseDetailPage, KnowledgePage, KnowledgeDetailPage } from "./pages/CaseKnowledgePages";
import AboutPage from "./pages/AboutPage";
import DetailPage from "./pages/DetailPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => <QueryClientProvider client={queryClient}><TooltipProvider><Toaster /><Sonner /><BrowserRouter><ScrollToTop /><div className="flex min-h-screen flex-col"><Header /><div className="flex-1"><Routes><Route path="/" element={<Index />} /><Route path="/sobre" element={<AboutPage />} /><Route path="/solucoes/:slug" element={<DetailPage />} /><Route path="/treinamentos/:slug" element={<DetailPage />} /><Route path="/blog" element={<BlogPage />} /><Route path="/blog/:slug" element={<BlogPostPage />} /><Route path="/conhecimentos" element={<KnowledgePage />} /><Route path="/conhecimentos/:slug" element={<KnowledgeDetailPage />} /><Route path="/cases" element={<CasesPage />} /><Route path="/cases/:slug" element={<CaseDetailPage />} /><Route path="/glossario" element={<GlossaryPage />} /><Route path="/glossario/:slug" element={<GlossaryTermPage />} /><Route path="*" element={<NotFound />} /></Routes></div><Footer /><LeadChat /></div></BrowserRouter></TooltipProvider></QueryClientProvider>;

export default App;
