// import React from 'react';

// export default function LegalDocumentsPage() {
//   const docs = [
//     { title: "Company Registration Certificate", src: "/docs/company-registration.jpg" },
//     { title: "PAN Registration Certificate", src: "/docs/pan-registration.jpg" },
//     { title: "Tourism Department License", src: "/docs/tourism-license.jpg" },
//     { title: "Foreign Exchange Certificate", src: "/docs/foreign-exchange.jpg" },
//     { title: "TAAN Membership Certificate", src: "/docs/taan-certificate.jpg" },
//     { title: "NMA Membership Certificate", src: "/docs/nma-certificate.jpg" },
//   ];

//   return (
//     <main className="bg-gray-50 text-gray-800 font-sans">
//       {/* Breadcrumb & Title */}
//       <section className="bg-white py-12">
//         <div className="max-w-5xl mx-auto px-6">
//           <nav className="text-sm text-gray-600 mb-4">
//             <a href="/" className="hover:underline">Home</a>
//             <span className="mx-2">/</span>
//             <span className="font-medium">Legal Documents</span>
//           </nav>
//           <h1 className="text-4xl font-bold mb-8">Legal Documents</h1>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {docs.map((doc) => (
//               <div key={doc.title} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
//                 <img
//                   src={doc.src}
//                   alt={doc.title}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-4">
//                   <h2 className="text-lg font-semibold text-gray-800">{doc.title}</h2>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact & Footer */}
//       <section className="bg-white py-8">
//         <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-600">
//           <p>For any inquiries regarding our legal documents, please contact us:</p>
//           <p className="mt-2">
//             Evertrek Nepal | Swyambhu Marga, Sorakhutte-16, Kathmandu, Nepal
//           </p>
//           <p className="mt-1">
//             Email: <a href="mailto:legal@evertreknepal.com" className="text-blue-600 hover:underline">legal@evertreknepal.com</a> | Phone: +977-01-1234567
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// }



import React from "react";
import AboutPageLayout from "./AboutPage.Layout.jsx";

export default function LegalDocumentsPage() {
  return <AboutPageLayout slug="legal-documents" />;
}
