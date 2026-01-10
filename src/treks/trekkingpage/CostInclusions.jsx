


import { motion } from "framer-motion";
import { ExcludeIcon, IncludeIcon } from "../../components/include.and.exlcude.icons";

const CostInclusions = ({
  inclusions = [],
  exclusions = [],
  title = "Cost Details",
  inclusionsTitle = "Includes",
  exclusionsTitle = "Excludes",
}) => {
  const hasInclusions = Array.isArray(inclusions) && inclusions.length > 0;
  const hasExclusions = Array.isArray(exclusions) && exclusions.length > 0;

  if (!hasInclusions && !hasExclusions) return null;

  const normalizeItem = (item) =>
    typeof item === "string"
      ? item
      : item?.text || item?.title || item?.description || "";

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Main heading */}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tight"
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Includes column */}
        {hasInclusions && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              {inclusionsTitle}
            </h3>

            <ul className="space-y-3">
              {inclusions.map((raw, idx) => {
                const text = normalizeItem(raw);
                if (!text) return null;

                return (
                  <li
                    key={`inc-${idx}`}
                    className="flex items-start gap-3 text-slate-800"
                  >
                    <span className="mt-0.5">
                      <IncludeIcon />
                    </span>
                    <p className="leading-relaxed text-[15px]">{text}</p>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}

        {/* Excludes column */}
        {hasExclusions && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              {exclusionsTitle}
            </h3>

            <ul className="space-y-3">
              {exclusions.map((raw, idx) => {
                const text = normalizeItem(raw);
                if (!text) return null;

                return (
                  <li
                    key={`exc-${idx}`}
                    className="flex items-start gap-3 text-slate-800"
                  >
                    <span className="mt-0.5">
                      <ExcludeIcon />
                    </span>
                    <p className="leading-relaxed text-[15px]">{text}</p>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CostInclusions;
