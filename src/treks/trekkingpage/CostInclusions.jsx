import { motion } from "framer-motion";
import { ExcludeIcon, IncludeIcon } from "../../components/include.and.exlcude.icons";

const CostInclusions = ({
  inclusions = [],
  exclusions = [],
  title = "What's Included",
  inclusionsTitle = "Included in Package",
  exclusionsTitle = "Not Included",
  subtitle = "Transparent pricing with no hidden costs",
}) => {
  const hasInclusions = Array.isArray(inclusions) && inclusions.length > 0;
  const hasExclusions = Array.isArray(exclusions) && exclusions.length > 0;

  if (!hasInclusions && !hasExclusions) return null;

  const normalizeItem = (item) =>
    typeof item === "string"
      ? item
      : item?.text || item?.title || item?.description || "";

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 text-base md:text-lg font-light">
            {subtitle}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Includes Section */}
        {hasInclusions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl p-8 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-emerald-500">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {inclusionsTitle}
              </h3>
            </div>

            {/* List items */}
            <ul className="space-y-4">
              {inclusions.map((raw, idx) => {
                const text = normalizeItem(raw);
                if (!text) return null;

                return (
                  <motion.li
                    key={`inc-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-start gap-3.5 group"
                  >
                    <span className="mt-1 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                      <IncludeIcon />
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[15px] md:text-base font-medium">
                      {text}
                    </p>
                  </motion.li>
                );
              })}
            </ul>

            {/* Premium badge */}
            <div className="mt-6 pt-6 border-t border-emerald-200/50">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-700 text-sm font-semibold">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Full Value Package
              </span>
            </div>
          </motion.div>
        )}

        {/* Excludes Section */}
        {hasExclusions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-50 via-white to-gray-50 rounded-2xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-400">
              <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {exclusionsTitle}
              </h3>
            </div>

            {/* List items */}
            <ul className="space-y-4">
              {exclusions.map((raw, idx) => {
                const text = normalizeItem(raw);
                if (!text) return null;

                return (
                  <motion.li
                    key={`exc-${idx}`}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-start gap-3.5 group"
                  >
                    <span className="mt-1 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                      <ExcludeIcon />
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[15px] md:text-base font-medium">
                      {text}
                    </p>
                  </motion.li>
                );
              })}
            </ul>

            {/* Info note */}
            <div className="mt-6 pt-6 border-t border-slate-200/50">
              <p className="text-sm text-slate-600 flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Additional services might be available upon request</span>
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 text-center"
      >
      
      </motion.div>
    </section>
  );
};

export default CostInclusions;
