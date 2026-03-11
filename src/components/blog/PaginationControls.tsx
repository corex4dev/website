import { useMemo } from "preact/hooks";
import { navigate } from "astro:transitions/client";
import type { JSX } from "preact/jsx-runtime";

interface Props {
  totalPages: number;
  currentPage: number;
  currentCategory?: string;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  currentCategory,
}: Props) => {
  const visiblePages = useMemo(() => {
    const visiblePages = new Set<number>();

    visiblePages.add(1);

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 0 && i <= totalPages) visiblePages.add(i);
    }

    visiblePages.add(totalPages);

    return [...visiblePages]
      .filter((p) => p > 0 && p <= totalPages)
      .sort((a, b) => a - b);
  }, [totalPages, currentPage]);

  if (totalPages <= 1) return null;

  const buildUrl = (targetPage: number) =>
    `/blog${currentCategory ? `/categoria/${currentCategory}` : ""}${
      targetPage > 1 ? `/page/${targetPage}` : ""
    }`;

  const NavigationButton = ({
    label,
    targetPage,
    active = false,
    disabled = false,
  }: {
    label: string;
    targetPage: number;
    active?: boolean;
    disabled?: boolean;
  }) => {
    return (
      <button
        disabled={disabled}
        className={`w-10 h-10 font-bold transition-all border rounded-xl disabled:opacity-30 disabled:cursor-not-allowed  ${
          active
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50 scale-110"
            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-400"
        }`}
        aria-current={active ? "page" : undefined}
        onClick={() => {
          navigate(buildUrl(targetPage));
        }}
      >
        {label}
      </button>
    );
  };

  const items: Array<JSX.Element> = [];
  let last: number = 0;
  visiblePages.forEach((p) => {
    const diff = p - last;

    if (diff === 2) {
      items.push(
        <NavigationButton
          key={`page-${last + 1}`}
          label={String(last + 1)}
          targetPage={last + 1}
        />,
      );
    } else if (diff > 2) {
      items.push(
        <button
          disabled
          className="disabled:opacity-30 disabled:cursor-not-allowed w-10 h-10 font-bold rounded-xl border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-400"
        >
          …
        </button>,
      );
    }

    items.push(
      <NavigationButton
        key={`page-${p}`}
        label={String(p)}
        targetPage={p}
        active={p === currentPage}
      />,
    );
    last = p;
  });

  return (
    <>
      <NavigationButton
        label="«"
        targetPage={currentPage - 1}
        active={false}
        disabled={currentPage <= 1}
      />
      {items}
      <NavigationButton
        label="»"
        targetPage={currentPage + 1}
        active={false}
        disabled={currentPage >= totalPages}
      />
    </>
  );
};

export default PaginationControls;
