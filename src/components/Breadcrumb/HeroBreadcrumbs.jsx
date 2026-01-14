import React from "react";
import { Link } from "react-router-dom";

const HeroBreadcrumbs = ({
  breadcrumbs = [],
  className = "",
  separator = ">",
  textClassName = "text-white/80 hover:text-white",
  separatorClassName = "text-white/60",
}) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`relative z-20 text-[11px] uppercase tracking-[0.4em] ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {breadcrumbs.map((crumb, index) => (
          <li
            key={crumb.url || `${crumb.label}-${index}`}
            className="flex items-center gap-1"
          >
            {index > 0 && (
              <span aria-hidden="true" className={separatorClassName}>
                {separator}
              </span>
            )}
            {crumb.url ? (
              <Link to={crumb.url} className={`transition-colors ${textClassName}`}>
                {crumb.label}
              </Link>
            ) : (
              <span className={textClassName}>{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default HeroBreadcrumbs;
