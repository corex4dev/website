import {
  getSearchIndex,
  globalSearch,
  type SearchEntityType,
  type SearchIndexItem,
} from "@/utils/search.service";
import { useEffect, useMemo, useState } from "preact/hooks";
import { navigate } from "astro:transitions/client";
import {
  ArrowRight,
  Calendar,
  Filter,
  SearchIcon,
  Tag,
  X,
} from "lucide-preact";

const RESULTS_PER_PAGE = 8;

function getParams() {
  return new URLSearchParams(window.location.search);
}

const SearchPage = () => {
  const initialQuery = getParams().get("q") ?? "";

  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<SearchEntityType | "all">(
    "all",
  );
  const [visibleCount, setVisibleCount] = useState(RESULTS_PER_PAGE);
  const [index, setIndex] = useState<SearchIndexItem[]>([]);

  useEffect(() => {
    getSearchIndex().then(setIndex);
  }, []);

  // Sync local query with URL
  useEffect(() => {
    setLocalQuery(initialQuery);
    setVisibleCount(RESULTS_PER_PAGE);
  }, [initialQuery]);

  const allResults = useMemo(
    () => globalSearch(initialQuery, index ?? []),
    [initialQuery, index],
  );

  const filteredResults = useMemo(() => {
    if (activeFilter === "all") return allResults;
    return allResults.filter((r) => r.type === activeFilter);
  }, [allResults, activeFilter]);

  const paginatedResults = useMemo(() => {
    return filteredResults.slice(0, visibleCount);
  }, [filteredResults, visibleCount]);

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate(`/buscar?q=${localQuery.trim()}`, { history: "replace" });
    }
  };

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "blog":
        return "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-400 dark:text-indigo-50 dark:border-indigo-500";
      case "video":
        return "bg-red-50 text-red-600 border-red-100 dark:bg-red-400 dark:text-red-50 dark:border-red-500";
      case "product":
        return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-400 dark:text-emerald-50 dark:border-emerald-500";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-400 dark:text-slate-50 dark:border-slate-500";
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

  const stats = useMemo(() => {
    return {
      all: allResults.length,
      post: allResults.filter((r) => r.type === "blog").length,
      video: allResults.filter((r) => r.type === "video").length,
      product: allResults.filter((r) => r.type === "product").length,
    };
  }, [allResults]);

  if (!initialQuery) {
    navigate("/", { history: "replace" });
  }

  return (
    <>
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-950 transition-shadow">
              <SearchIcon size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Buscador Global
            </h1>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full md:w-96 md:max-w-96"
          >
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery((e.target as any)?.value)}
              placeholder="Nueva búsqueda..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border input-field focus:outline-none font-medium"
            />
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => setLocalQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-500"
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Dynamic Filters */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 -mt-4">
          <Filter size={16} className="text-slate-400 mr-2 shrink-0" />
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4 ps-2">
            {[
              { id: "all", label: "Todos", count: stats.all },
              { id: "blog", label: "Artículos", count: stats.post },
              { id: "video", label: "Vídeos", count: stats.video },
              { id: "product", label: "Productos", count: stats.product },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id as any);
                  setVisibleCount(RESULTS_PER_PAGE);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  activeFilter === filter.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 dark:bg-slate-50 dark:text-slate-600 dark:shadow-slate-800"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:border-slate-700"
                }`}
              >
                {filter.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    activeFilter === filter.id
                      ? "bg-white/20 text-white dark:bg-slate-400"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-700"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {paginatedResults.length > 0 ? (
        <div className="space-y-4">
          {paginatedResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="card rounded-2xl border p-4 hover:shadow-md transition-all group flex gap-4 md:gap-6 items-center"
            >
              {result.image && (
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <img
                    src={result.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getBadgeStyles(result.type)}`}
                  >
                    {getLabel(result.type)}
                  </span>
                  <div className="flex items-center gap-1 overflow-x-scroll scrollbar-hide">
                    {result.categories?.map((c) => (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Tag size={10} /> {c}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-base md:text-lg font-bold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {result.title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm line-clamp-1 md:line-clamp-2 mb-2">
                  {result.description}
                </p>

                <div className="flex items-center justify-between">
                  {result.date && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Calendar size={10} />{" "}
                      {Intl.DateTimeFormat("es-MX", {
                        dateStyle: "medium",
                      }).format(new Date(result.date))}
                    </span>
                  )}
                  <div className="ml-auto">
                    {result.link.startsWith("http") ? (
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:gap-2 transition-all"
                      >
                        Ver más <ArrowRight size={14} />
                      </a>
                    ) : (
                      <a
                        href={result.link}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:gap-2 transition-all"
                      >
                        Ver más <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredResults.length > visibleCount && (
            <div className="pt-8 text-center">
              <button
                onClick={() =>
                  setVisibleCount((prev) => prev + RESULTS_PER_PAGE)
                }
                className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-700 transition-all shadow-sm"
              >
                Cargar más resultados
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 card rounded-[2.5rem] border-2 border-dashed">
          <div className="w-16 h-16 bg-white dark:bg-indigo-950 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <SearchIcon size={24} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-black mb-2">Sin resultados</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto mb-6">
            No hemos encontrado nada para "{initialQuery}" con los filtros
            actuales.
          </p>
        </div>
      )}
    </>
  );
};

export default SearchPage;
