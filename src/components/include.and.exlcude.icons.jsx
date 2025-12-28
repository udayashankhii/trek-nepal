// src/components/CostIcons.jsx
export const IncludeIcon = () => (
  <span className="inline-flex h-6 w-6 shrink-0 grow-0 items-center justify-center rounded-full border-[1.5px] border-emerald-500 text-emerald-500">
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path
        d="M3 8.5 6.2 11.5 13 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export const ExcludeIcon = () => (
  <span className="inline-flex h-6 w-6 shrink-0 grow-0 items-center justify-center rounded-full border-[1.5px] border-rose-400 text-rose-400">
    <span className="block h-[1.6px] w-3.5 bg-rose-400 rounded-full" />
  </span>
);
