import { useEffect, useRef, useState, useCallback } from "preact/hooks";
import {
  getSearchIndex,
  getSuggestions,
  globalSearch,
  type SearchIndexItem,
  type SearchResult,
} from "@/utils/search.service";
import { navigate } from "astro:transitions/client";
import type { ButtonHTMLAttributes } from "preact";
import {
  ArrowRight,
  FileText,
  Play,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-preact";

const OPEN_EVENT = "global-search:open";
const CLOSE_EVENT = "global-search:close";

/** Programmatic API (opcional) */
export const openGlobalSearch = (query?: string) =>
  window.dispatchEvent(
    new CustomEvent(OPEN_EVENT, { detail: { query }, bubbles: true }),
  );
export const closeGlobalSearch = () =>
  window.dispatchEvent(new CustomEvent(CLOSE_EVENT, { bubbles: true }));

/** Trigger: botón reutilizable que abre el modal desde cualquier lugar */
export const GlobalSearchTrigger = ({
  children,
  className,
  query,
  ...props
}: {
  children?: preact.ComponentChildren;
  className?: string;
  query?: string;
} & ButtonHTMLAttributes) => {
  const onClick = (e: Event) => {
    e?.preventDefault?.();
    openGlobalSearch(query);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openGlobalSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <button
      {...props}
      type="button"
      onClick={onClick}
      className={className ?? "px-3 py-2 rounded-md bg-slate-50"}
    >
      {children ?? "Buscar"}
    </button>
  );
};

/** Componente principal (la isla/modal) */
const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  const [index, setIndex] = useState<SearchIndexItem[] | null>(null);

  useEffect(() => {
    getSearchIndex().then(setIndex);
  }, []);

  // Abrir / cerrar desde eventos globales
  useEffect(() => {
    const onOpen = (ev: Event) => {
      const detail = (ev as CustomEvent)?.detail ?? {};
      if (detail.query) setQuery(String(detail.query));
      setIsOpen(true);
    };
    const onClose = () => setIsOpen(false);

    window.addEventListener(OPEN_EVENT, onOpen as EventListener);
    window.addEventListener(CLOSE_EVENT, onClose);

    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen as EventListener);
      window.removeEventListener(CLOSE_EVENT, onClose);
    };
  }, []);

  // focus y overflow cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      // focus con pequeño retardo para asegurar el render
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
      };
    } else {
      document.body.style.overflow = "unset";
      // reseteamos estado para evitar datos residuales
      setQuery("");
      setResults([]);
      setSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Debounce en búsqueda para mejorar rendimiento
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    // si campo vacío, limpiamos resultados (pero mantenemos sugerencias si quieres)
    if (query.trim() === "") {
      setResults([]);
      // opcional: mantener sugerencias estáticas o vaciarlas
      setSuggestions([]);
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      // usar las funciones síncronas/rápidas que ya tienes
      const searchResults = globalSearch(query, index ?? []);
      const searchSuggestions = getSuggestions(query, index ?? []);

      setResults(searchResults.slice(0, 5));
      setSuggestions(searchSuggestions);
      debounceRef.current = null;
    }, 180); // 180ms debounce

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [query, index]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSearch = (e: Event | undefined) => {
    e?.preventDefault?.();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "blog":
        return "Artículo";
      case "video":
        return "Vídeo";
      case "product":
        return "Producto";
      default:
        return "Resultado";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText size={18} className="text-indigo-500" />;
      case "video":
        return <Play size={18} className="text-red-500" />;
      case "product":
        return <ShoppingBag size={18} className="text-emerald-500" />;
      default:
        return <FileText size={18} />;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-1001 flex items-start justify-center pt-20 px-4 sm:pt-32">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-4xl shadow-2xl border border-slate-200 overflow-hidden">
            <form
              onSubmit={(e) => handleSearch(e as unknown as Event)}
              className="p-4 border-b border-slate-100 flex items-center gap-4"
            >
              <Search className="text-slate-400 ml-2" size={24} />
              <input
                ref={inputRef}
                autoFocus
                type="search"
                placeholder="Busca tutoriales, vídeos o productos..."
                value={query}
                onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                className="flex-1 bg-transparent focus:ring-0 outline-0 text-lg border-b border-slate-200 placeholder:text-slate-400 py-2"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {query.trim() === "" ? (
                <div className="p-8 text-center">
                  <p className="text-slate-500">
                    Escribe algo para empezar a buscar...
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {["Stripe", "CMS", "Next.js", "Auth.js"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm text-slate-600 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 || suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.length > 0 && (
                    <div className="px-2 pt-2">
                      <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Sparkles size={12} className="text-indigo-400" />
                        <span>Sugerencias rápidas</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, idx) => (
                          <button
                            key={`suggest-${idx}`}
                            onClick={() => setQuery(suggestion)}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Resultados relevantes
                      </div>
                      {results.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => {
                            if (result.link.startsWith("http")) {
                              window.open(result.link, "_blank");
                            } else {
                              navigate(result.link);
                            }
                            onClose();
                          }}
                          className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group text-left"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                            {result.image ? (
                              <img
                                src={result.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              getIcon(result.type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                {getLabel(result.type)}
                              </span>
                              <h4 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                {result.title}
                              </h4>
                            </div>
                            <p className="text-sm text-slate-500 truncate">
                              {result.description}
                            </p>
                          </div>
                          <ArrowRight
                            size={18}
                            className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleSearch(undefined)}
                    className="w-full p-4 text-center text-indigo-600 font-bold hover:bg-indigo-50 rounded-2xl transition-colors mt-2"
                  >
                    Ver todos los resultados para "{query}"
                  </button>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500">
                    No se encontraron resultados para "{query}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
