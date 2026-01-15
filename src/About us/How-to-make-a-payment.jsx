// import React from "react";
// import { CreditCard, Globe, Smartphone, ShieldCheck } from "lucide-react";
// import { motion } from "framer-motion";

// export default function PaymentGuide() {
//   return (
//     <div className="bg-gray-50 text-gray-800">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-br from-blue-600 to-green-500 text-white py-20 px-6 md:px-12 rounded-b-3xl shadow-lg">
//         <h1 className="text-4xl md:text-5xl font-extrabold mb-4 max-w-3xl">
//           How to Make a Payment
//           <br />
//           on Evertrek Nepal
//         </h1>
//         <p className="text-lg md:text-xl opacity-90 max-w-2xl">
//           Seamlessly book your dream trek in Nepal using international cards,
//           local payment methods, and mobile wallets. Follow these simple steps
//           and you’re ready to explore the Himalayas!
//         </p>
//         <motion.img
//           src="/everest.jpeg"
//           alt="Mountain Hero"
//           className="absolute bottom-0 right-0 w-1/3 opacity-30"
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 0.3, x: 0 }}
//           transition={{ duration: 1 }}
//         />
//       </section>

//       {/* Payment Methods */}
//       <section className="py-16 px-6 md:px-12">
//         <h2 className="text-3xl font-bold mb-8 text-center">Payment Methods</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//             <CreditCard className="w-12 h-12 text-blue-600 mb-4" />
//             <h3 className="text-xl font-semibold mb-2">International Cards</h3>
//             <p className="opacity-80">
//               Visa, MasterCard, American Express. Secure and accepted worldwide.
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//             <Globe className="w-12 h-12 text-green-600 mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Bank Transfer</h3>
//             <p className="opacity-80">
//               Swift and NEFT transfers via major Nepali banks like Nabil,
//               Everest Bank.
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//             <Smartphone className="w-12 h-12 text-purple-600 mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Mobile Wallets</h3>
//             <p className="opacity-80">
//               eSewa, Khalti, IME Pay. Instantly pay via QR or UPI.
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//             <ShieldCheck className="w-12 h-12 text-indigo-600 mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Cash on Arrival</h3>
//             <p className="opacity-80">
//               Pay in cash at our Kathmandu office when you arrive.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Step-by-Step Guide */}
//       <section className="bg-white py-16 px-6 md:px-12">
//         <h2 className="text-3xl font-bold mb-12 text-center">
//           Step-by-Step Payment Process
//         </h2>
//         <div className="space-y-12 max-w-4xl mx-auto">
//           {[
//             {
//               step: 1,
//               title: "Select Your Trek",
//               desc: `Browse our curated trek packages, customize dates and group size,
//                 then click “Book Now” to begin payment.`,
//             },
//             {
//               step: 2,
//               title: "Enter Traveler Details",
//               desc: `Fill in names, contact info, and passport details for each
//                 trekker. Accuracy ensures a hassle-free experience.`,
//             },
//             {
//               step: 3,
//               title: "Choose Payment Method",
//               desc: `Pick from International Cards, Bank Transfer, Mobile Wallets,
//                 or Cash on Arrival.`,
//             },
//             {
//               step: 4,
//               title: "Complete Secure Checkout",
//               desc: `Enter card details or scan QR for wallet. All data is
//                 encrypted with SSL.`,
//             },
//             {
//               step: 5,
//               title: "Receive Confirmation",
//               desc: `Get instant email and SMS receipt. You're all set for your
//                 Himalayan adventure!`,
//             },
//           ].map(({ step, title, desc }) => (
//             <div key={step} className="flex items-start">
//               <div className="flex-shrink-0">
//                 <div className="text-2xl font-extrabold text-blue-500">
//                   {step}
//                 </div>
//               </div>
//               <div className="ml-6">
//                 <h3 className="text-xl font-semibold mb-2">{title}</h3>
//                 <p className="opacity-85 leading-relaxed">{desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Security & Support */}
//       <section className="py-16 px-6 md:px-12 bg-gradient-to-tr from-gray-100 to-white">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-6">Secure & Supported</h2>
//           <p className="mb-8 opacity-90">
//             We take your security seriously. All transactions are PCI DSS
//             compliant, SSL/TLS encrypted, and monitored 24/7.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-6 justify-center">
//             <motion.a
//               href="/contact"
//               className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
//               whileHover={{ scale: 1.05 }}
//             >
//               Contact Support
//             </motion.a>
//             <a
//               href="/faq#payment"
//               className="inline-block px-8 py-4 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition"
//             >
//               View Payment FAQ
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Footer Wave Divider */}
//       <div className="relative mt-[-2px]">
//         <svg
//           viewBox="0 0 1440 60"
//           className="w-full h-16 block"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fill="#ffffff"
//             d="M0,32 C360,112 720,0 1440,32 L1440,60 L0,60 Z"
//           />
//         </svg>
//       </div>
//     </div>
//   );
// }



import React from "react";
import AboutPageLayout from "./AboutPage.Layout.jsx";

export default function PaymentGuide() {
  return <AboutPageLayout slug="how-to-make-a-payment" />;
}
