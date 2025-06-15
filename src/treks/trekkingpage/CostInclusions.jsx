import { useState } from "react";
import { motion } from "framer-motion";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const TrekCostDetails = ({
  inclusions = [],
  exclusions = [],
  title = "Trip Cost Details",
  inclusionsTitle = "Cost Includes",
  exclusionsTitle = "Cost Excludes",
}) => {
  const [activeTab, setActiveTab] = useState("inclusions");

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Review what's included in your trek package and additional expenses
            you should budget for.
          </p>
        </motion.div>

        {/* Tab Navigation (Mobile-optimized) */}
        <div className="md:hidden flex rounded-lg overflow-hidden border border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("inclusions")}
            className={`flex-1 py-3 font-medium text-sm ${
              activeTab === "inclusions"
                ? "bg-teal-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {inclusionsTitle}
          </button>
          <button
            onClick={() => setActiveTab("exclusions")}
            className={`flex-1 py-3 font-medium text-sm ${
              activeTab === "exclusions"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {exclusionsTitle}
          </button>
        </div>

        {/* Desktop & Tablet View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inclusions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
              activeTab === "inclusions" || activeTab === "both"
                ? "block"
                : "hidden md:block"
            }`}
          >
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <CheckCircleIcon className="h-6 w-6 mr-2" />
                {inclusionsTitle}
              </h3>
            </div>
            <ul className="divide-y divide-gray-100 p-6">
              {inclusions.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="py-3 flex gap-4 group"
                >
                  <div className="flex-shrink-0 text-teal-500 mt-0.5">
                    <CheckCircleIcon className="h-5 w-5 transition duration-300 group-hover:scale-110" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Exclusions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
              activeTab === "exclusions" || activeTab === "both"
                ? "block"
                : "hidden md:block"
            }`}
          >
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <XCircleIcon className="h-6 w-6 mr-2" />
                {exclusionsTitle}
              </h3>
            </div>
            <ul className="divide-y divide-gray-100 p-6">
              {exclusions.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="py-3 flex gap-4 group"
                >
                  <div className="flex-shrink-0 text-red-500 mt-0.5">
                    <XCircleIcon className="h-5 w-5 transition duration-300 group-hover:scale-110" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 p-5 border border-blue-100 bg-blue-50 rounded-xl"
        >
          <h4 className="text-blue-800 font-semibold mb-2">Important Notes</h4>
          <p className="text-sm text-blue-700">
            Package pricing may vary based on group size, season, and
            customization options. For any queries about inclusions or
            exclusions, please contact our travel specialists.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrekCostDetails;
