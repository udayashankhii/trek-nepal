// TrekDescription.jsx
import { Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function TrekDescription({ overview, sections = [] }) {
  return (
    <section className="relative bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl shadow-2xl px-8 py-12 my-10 max-w-4xl mx-auto">
      {/* Main Heading */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight font-manrope">
        Trek Overview
      </h2>
      {/* Main Overview */}
      <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
        {overview}
      </p>

      {/* Collapsible Sections for Details */}
      <div className="divide-y divide-slate-200">
        {sections.map(
          (section, idx) =>
            +(
              {
                /* render as a real <div> instead of Fragment */
              }
            ) +
            (
              <Disclosure key={idx} as="div" defaultOpen={idx === 0}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between items-center w-full py-4 text-left focus:outline-none">
                      <span className="text-xl font-semibold text-blue-800">
                        {section.title}
                      </span>
                      <ChevronDownIcon
                        className={`h-6 w-6 text-blue-600 transform transition-transform duration-200 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </Disclosure.Button>
                    <Transition
                      show={open}
                      enter="transition-opacity duration-200"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition-opacity duration-150"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Disclosure.Panel static>
                        <div className="prose max-w-none text-gray-800 pb-6">
                          {section.content}
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            )
        )}
      </div>
    </section>
  );
}
