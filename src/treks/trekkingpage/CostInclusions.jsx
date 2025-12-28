// // src/trekkingpage/CostInclusions.jsx
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

// const CostInclusions = ({
//   inclusions = [],
//   exclusions = [],
//   title = "Trip Cost Details",
//   inclusionsTitle = "Cost Includes",
//   exclusionsTitle = "Cost Excludes",
//   defaultActiveTab = "inclusions",
// }) => {
//   const [activeTab, setActiveTab] = useState(defaultActiveTab);

//   // Safe rendering with proper error handling
//   const renderList = (items, Icon, iconColor, textColor) => {
//     if (!Array.isArray(items) || items.length === 0) {
//       return (
//         <div className="p-6 text-center text-gray-500">
//           <p>No items available</p>
//         </div>
//       );
//     }

//     return (
//       <ul className="divide-y divide-gray-100 p-6">
//         {items.map((item, idx) => {
//           // Handle both string and object formats from API
//           const itemText = typeof item === 'string' ? item : item?.text || item?.title || item?.description || '';
          
//           if (!itemText) return null;

//           return (
//             <motion.li
//               key={`${textColor}-${idx}-${itemText.substring(0, 20)}`}
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: idx * 0.05, duration: 0.4 }}
//               className="py-3 flex gap-4 group"
//             >
//               <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
//                 <Icon className="h-5 w-5 transition duration-300 group-hover:scale-110" />
//               </div>
//               <p className={`leading-relaxed ${textColor}`}>{itemText}</p>
//             </motion.li>
//           );
//         })}
//       </ul>
//     );
//   };

//   // Check if we have any data to display
//   const hasInclusions = Array.isArray(inclusions) && inclusions.length > 0;
//   const hasExclusions = Array.isArray(exclusions) && exclusions.length > 0;
//   const hasAnyData = hasInclusions || hasExclusions;

//   // Don't render section if no data
//   if (!hasAnyData) {
//     return null;
//   }

//   return (
//     <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//       <div className="max-w-5xl mx-auto">
//         {/* Section Heading */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-10"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
//             {title}
//           </h2>
//           <p className="text-gray-600 max-w-3xl mx-auto">
//             Review what's included in your trek package and additional expenses
//             you should budget for.
//           </p>
//         </motion.div>

//         {/* Tab Navigation (Mobile-optimized with accessibility) */}
//         {hasInclusions && hasExclusions && (
//           <div
//             className="md:hidden flex rounded-lg overflow-hidden border border-gray-200 mb-8"
//             role="tablist"
//             aria-label="Cost details tabs"
//           >
//             <button
//               onClick={() => setActiveTab("inclusions")}
//               className={`flex-1 py-3 font-medium text-sm transition-colors ${
//                 activeTab === "inclusions"
//                   ? "bg-teal-500 text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-50"
//               }`}
//               role="tab"
//               aria-selected={activeTab === "inclusions"}
//               aria-controls="cost-inclusions-panel"
//               id="cost-inclusions-tab"
//             >
//               {inclusionsTitle}
//             </button>
//             <button
//               onClick={() => setActiveTab("exclusions")}
//               className={`flex-1 py-3 font-medium text-sm transition-colors ${
//                 activeTab === "exclusions"
//                   ? "bg-red-500 text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-50"
//               }`}
//               role="tab"
//               aria-selected={activeTab === "exclusions"}
//               aria-controls="cost-exclusions-panel"
//               id="cost-exclusions-tab"
//             >
//               {exclusionsTitle}
//             </button>
//           </div>
//         )}

//         {/* Desktop & Tablet View */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Inclusions */}
//           {hasInclusions && (activeTab === "inclusions" || window.innerWidth >= 768) && (
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6 }}
//               className="bg-white rounded-2xl shadow-xl overflow-hidden"
//               role="tabpanel"
//               aria-labelledby="cost-inclusions-tab"
//               id="cost-inclusions-panel"
//             >
//               <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
//                 <h3 className="text-xl font-bold text-white flex items-center">
//                   <CheckCircleIcon className="h-6 w-6 mr-2" />
//                   {inclusionsTitle}
//                 </h3>
//               </div>
//               {renderList(inclusions, CheckCircleIcon, "text-teal-500", "text-gray-700")}
//             </motion.div>
//           )}

//           {/* Exclusions */}
//           {hasExclusions && (activeTab === "exclusions" || window.innerWidth >= 768) && (
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.15 }}
//               className="bg-white rounded-2xl shadow-xl overflow-hidden"
//               role="tabpanel"
//               aria-labelledby="cost-exclusions-tab"
//               id="cost-exclusions-panel"
//             >
//               <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
//                 <h3 className="text-xl font-bold text-white flex items-center">
//                   <XCircleIcon className="h-6 w-6 mr-2" />
//                   {exclusionsTitle}
//                 </h3>
//               </div>
//               {renderList(exclusions, XCircleIcon, "text-red-500", "text-gray-700")}
//             </motion.div>
//           )}
//         </div>

//         {/* Full Width Grid if only one section has data */}
//         {hasInclusions && !hasExclusions && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto"
//           >
//             <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
//               <h3 className="text-xl font-bold text-white flex items-center">
//                 <CheckCircleIcon className="h-6 w-6 mr-2" />
//                 {inclusionsTitle}
//               </h3>
//             </div>
//             {renderList(inclusions, CheckCircleIcon, "text-teal-500", "text-gray-700")}
//           </motion.div>
//         )}

//         {!hasInclusions && hasExclusions && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto"
//           >
//             <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
//               <h3 className="text-xl font-bold text-white flex items-center">
//                 <XCircleIcon className="h-6 w-6 mr-2" />
//                 {exclusionsTitle}
//               </h3>
//             </div>
//             {renderList(exclusions, XCircleIcon, "text-red-500", "text-gray-700")}
//           </motion.div>
//         )}

//         {/* Notes Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className="mt-8 p-5 border border-blue-100 bg-blue-50 rounded-xl"
//         >
//           <h4 className="text-blue-800 font-semibold mb-2">Important Notes</h4>
//           <p className="text-sm text-blue-700">
//             Package pricing may vary based on group size, season, and
//             customization options. For any queries about inclusions or
//             exclusions, please contact our travel specialists.
//           </p>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default CostInclusions;





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
