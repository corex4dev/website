const searchFunc = () => {
    const videosContainer = document.getElementById("videos");
    if (!videosContainer) return;

    // evitar doble init (astro:page-load + after-swap)
    if (videosContainer?.__initialized) return;
    videosContainer.__initialized = true;

    // cache global por ruta
    window.__VIDEOS_CACHE__ ??= {};
    const cacheKey = location.pathname;

    let videos;

    if (window.__VIDEOS_CACHE__[cacheKey]) {
        videos = window.__VIDEOS_CACHE__[cacheKey];
    } else {
        videos = Array.from(videosContainer.querySelectorAll(":scope > a")).map(
            (el) => ({
                el,
                title: el.querySelector("h3")?.textContent || "",
            }),
        );

        window.__VIDEOS_CACHE__[cacheKey] = videos;

        // remover del DOM SOLO primera vez
        videos.forEach((v) => videosContainer.removeChild(v.el));
    }

    const qInput = document.getElementById("searchInput");
    const empty = document.getElementById("emptyStateVideos");
    const filteredCount = document.getElementById("filteredVideosNumber");
    const clearBtn = document.getElementById("clearEmptySearch");

    const filterCache = new Map();

    // ---------------------------
    // renderer virtual
    // ---------------------------
    function renderVideos(list) {
        videosContainer.querySelectorAll("a").forEach((el) => el.remove());

        const fragment = document.createDocumentFragment();
        list.forEach((v) => fragment.appendChild(v.el));

        videosContainer.prepend(fragment);
    }

    // ---------------------------
    // filtro cacheado
    // ---------------------------
    function getFilteredVideos(q) {
        const key = q.toLowerCase();

        if (filterCache.has(key)) {
            return filterCache.get(key);
        }

        const result = videos.filter(
            (v) => !key || v.title.toLowerCase().includes(key),
        );

        filterCache.set(key, result);
        return result;
    }

    // ---------------------------
    // contador dinámico
    // ---------------------------
    function renderCount(filteredTotal) {
        if (!filteredCount) return;
        filteredCount.textContent = String(filteredTotal);
    }

    // ---------------------------
    // render principal
    // ---------------------------
    function filterAndRender(q) {
        const filteredVideos = getFilteredVideos(q);

        renderVideos(filteredVideos);
        renderCount(filteredVideos.length);

        empty?.classList.toggle("hidden", filteredVideos.length !== 0);
    }

    // ---------------------------
    // URL state
    // ---------------------------
    function updateURL(q) {
        const params = new URLSearchParams(location.search);

        if (q) params.set("q", q);
        else params.delete("q");

        const newUrl =
            location.pathname +
            (params.toString() ? "?" + params.toString() : "");

        history.replaceState(null, "", newUrl);
    }

    function clearSearch() {
        if (!qInput) return;
        qInput.value = "";
        updateURL("");
        filterAndRender("");
        qInput.focus();
    }

    // ---------------------------
    // eventos
    // ---------------------------
    if (qInput) {
        qInput.oninput = () => {
            updateURL(qInput.value);
            filterAndRender(qInput.value);
        };
    }

    clearBtn?.addEventListener("click", clearSearch);

    // ---------------------------
    // estado inicial desde URL
    // ---------------------------
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";

    if (qInput) qInput.value = q;

    filterAndRender(q);
};

document.addEventListener("astro:page-load", searchFunc);
document.addEventListener("astro:after-swap", searchFunc);