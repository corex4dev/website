window.__BLOG_POSTS_CACHE__ ??= {};

const searchFuncPosts = () => {
    const postsContainer = document.getElementById("posts");

    if (postsContainer.__initialized) return;
    postsContainer.__initialized = true;

    const PER_PAGE = 1;
    let currentPage = 1;

    const cacheKey = location.pathname;
    let posts;

    if (window.__BLOG_POSTS_CACHE__[cacheKey]) {
        posts = window.__BLOG_POSTS_CACHE__[cacheKey];
    } else {
        posts = Array.from(postsContainer.querySelectorAll(":scope > a")).map(
            (el) => ({
                el,
                title: el.querySelector("h3")?.textContent || "",
            }),
        );

        window.__BLOG_POSTS_CACHE__[cacheKey] = posts;
        posts.forEach((p) => postsContainer.removeChild(p.el));
    }

    const qInput = document.getElementById("searchInput");
    const empty = document.getElementById("emptyStatePosts");
    const clearBtn = document.getElementById("clearEmptySearch");
    const countInfo = document.getElementById("postsCountInfo");
    const totalPostsCount = posts.length;

    function renderCount(filteredTotal, visibleCount) {
        if (!countInfo) return;
        const word = filteredTotal === 1 ? "artículo" : "artículos";

        if (filteredTotal === 0) {
            countInfo.textContent = "No hay artículos que coincidan.";
            return;
        }

        const start = (currentPage - 1) * PER_PAGE + 1;
        const end = start + visibleCount - 1;

        if (filteredTotal === totalPostsCount) {
            // sin filtro
            countInfo.textContent = `Mostrando ${start} - ${end} de ${totalPostsCount} ${word}`;
        } else {
            // con filtro activo
            countInfo.textContent = `Mostrando ${start} - ${end} de ${filteredTotal} ${word} (${totalPostsCount} totales)`;
        }
    }

    function renderPosts(list) {
        // limpiar grid
        postsContainer.querySelectorAll("a").forEach((el) => el.remove());

        const fragment = document.createDocumentFragment();

        list.forEach((p) => {
            fragment.appendChild(p.el);
        });

        postsContainer.prepend(fragment);
    }

    function filterAndRender(q) {
        const ql = q.trim().toLowerCase();

        // 1️⃣ filtrar
        const filteredPosts = posts.filter(
            (p) => !ql || p.title.toLowerCase().includes(ql),
        );

        const totalPages = Math.ceil(filteredPosts.length / PER_PAGE);
        if (currentPage > totalPages) currentPage = 1;

        // 2️⃣ paginar
        const visiblePosts = paginate(filteredPosts, currentPage);

        // 3️⃣ render REAL
        renderPosts(visiblePosts);
        renderCount(filteredPosts.length, visiblePosts.length);

        // empty state
        empty?.classList.toggle("hidden", filteredPosts.length !== 0);

        // filtered.innerText = String(filteredPosts.length);

        // 4️⃣ pagination UI
        renderPagination(filteredPosts.length, currentPage);
    }

    // Cuando el usuario cambia filtros -> actualiza URL sin crear nuevo historial
    function updateURL(q, page = 1) {
        const params = new URLSearchParams(location.search);

        if (q) params.set("q", q);
        else params.delete("q");

        if (page > 1) params.set("page", page);
        else params.delete("page");

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

    if (qInput) {
        qInput.oninput = () => {
            updateURL(qInput.value);
            filterAndRender(qInput.value);
        };
    }

    // botón externo
    if (clearBtn) {
        clearBtn.onclick = clearSearch;
    }

    // Pagination
    function paginate(items, page) {
        const start = (page - 1) * PER_PAGE;
        const end = start + PER_PAGE;
        return items.slice(start, end);
    }

    const paginationEl = document.getElementById("pagination");

    function renderPagination(totalItems, page) {
        if (!paginationEl) return;

        const totalPages = Math.ceil(totalItems / PER_PAGE);
        paginationEl.innerHTML = "";

        if (totalPages <= 1) return;

        const createBtn = (label, targetPage, active = false, disabled = false) => {
            const btn = document.createElement("button");

            btn.disabled = disabled
            btn.textContent = label;
            btn.className =
                "w-10 h-10 font-bold transition-all rounded-xl disabled:opacity-30 disabled:cursor-not-allowed " +
                (active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600');

            btn.onclick = () => {
                currentPage = targetPage;
                updateURL(qInput?.value || "", currentPage);
                filterAndRender(qInput?.value || "");
                window.scrollTo({ top: 0, behavior: "smooth" });
            };

            return btn;
        };

        const createDots = () => {
            const span = document.createElement("span");
            span.textContent = "…";
            span.className = "px-2 text-slate-400";
            return span;
        };

        // ◀ PREV
        paginationEl.appendChild(createBtn("«", page - 1, false, page <= 1));

        const visiblePages = new Set();

        // primeras
        visiblePages.add(1);
        visiblePages.add(2);

        // alrededor de la actual
        for (let i = page - 1; i <= page + 1; i++) {
            if (i > 0 && i <= totalPages) visiblePages.add(i);
        }

        // últimas
        visiblePages.add(totalPages);
        visiblePages.add(totalPages - 1);

        const sortedPages = [...visiblePages]
            .filter((p) => p > 0 && p <= totalPages)
            .sort((a, b) => a - b);

        let lastPage = 0;

        sortedPages.forEach((p) => {
            if (p - lastPage > 1) {
                paginationEl.appendChild(createDots());
            }

            paginationEl.appendChild(createBtn(String(p), p, p === page));
            lastPage = p;
        });

        // ▶ NEXT
        paginationEl.appendChild(createBtn("»", page + 1, false, page >= totalPages));
    }

    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    currentPage = Number(params.get("page") || "1");
    if (qInput) qInput.value = q;
    filterAndRender(q);
};

document.addEventListener("astro:page-load", searchFuncPosts);
document.addEventListener("astro:after-swap", searchFuncPosts);