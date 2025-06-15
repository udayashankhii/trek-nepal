import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-gray-50 text-gray-800 font-sans">
      {/* Breadcrumb & Title */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="text-sm text-gray-600 mb-4">
            <a href="/" className="hover:underline">
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="font-medium">Privacy Policy</span>
          </nav>
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <div className="space-y-6 leading-relaxed text-base">
            <p>
              At Evertrek Nepal, we understand that your personal information is
              valuable and that protecting your privacy is essential. This
              Privacy Policy outlines the types of data we collect, how we use
              it, how we keep it secure, and your rights regarding your
              information when you visit our website or book a trek with us.
            </p>

            {/* Section: Information Collected */}
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">
                Information We Collect
              </h2>
              <p className="mb-4">
                To provide you with exceptional service and a seamless booking
                experience, we collect the following categories of personal
                information:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Identity Information:</strong> Full name, date of
                  birth, gender, nationality, and passport or national ID
                  number. This information is necessary to reserve permits and
                  ensure compliance with local travel regulations.
                </li>
                <li>
                  <strong>Contact Details:</strong> Residential address, email
                  address, and telephone number. We use these details to
                  communicate booking confirmations, itinerary updates, and
                  emergency notifications.
                </li>
                <li>
                  <strong>Booking Details:</strong> Trek package selected,
                  travel dates, group size, and special requirements (e.g.,
                  dietary restrictions, medical conditions). This helps us
                  tailor your trip and arrange accommodations, guides, and
                  logistics.
                </li>
                <li>
                  <strong>Payment Information:</strong> While we do not store
                  your credit or debit card information on our servers, we
                  collect payment confirmation details, such as transaction IDs
                  and payment method metadata, via our secure third-party
                  gateways (PCI DSS-compliant).
                </li>
                <li>
                  <strong>Optional Information:</strong> Social media handles
                  (if you choose to connect your profile), demographic data for
                  surveys, and marketing preferences.
                </li>
              </ul>
              <p className="mt-4">
                We collect information in the following ways:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Directly when you fill out forms on our website.</li>
                  <li>Automatically through cookies and analytics tools.</li>
                  <li>
                    From trusted third parties, such as payment processors and
                    travel permit authorities.
                  </li>
                </ul>
              </p>
            </div>

            {/* Section: Security */}
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">
                Security of Information
              </h2>
              <p>
                We prioritize the security of your personal data. All sensitive
                information transmitted to our website is encrypted using
                industry-standard SSL/TLS protocols. Our servers and databases
                reside in secure data centers with strict access controls,
                firewalls, and intrusion detection systems.
              </p>
              <p className="mt-4">
                We adhere to the following measures to safeguard your
                information:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>
                    Regular security audits and vulnerability assessments.
                  </li>
                  <li>
                    Role-based access restrictions—only authorized personnel can
                    access personal data.
                  </li>
                  <li>
                    Routine backups and encrypted storage of critical data.
                  </li>
                  <li>
                    Immediate response protocols for any suspected data breach,
                    including user notification and corrective actions.
                  </li>
                </ul>
              </p>
            </div>

            {/* Section: Use of Google Analytics */}
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">
                Use of Google Analytics
              </h2>
              <p>
                We use Google Analytics to gain insights into how visitors
                interact with our site, which pages are most popular, and how
                users navigate through our booking process. This data helps us
                improve website performance, optimize content, and deliver a
                better user experience.
              </p>
              <p className="mt-4">
                The information collected may include your IP address
                (anonymized), browser type, device information, referral URLs,
                and timing of visits. Google Analytics does not provide us with
                personally identifiable information, and you can opt out of
                tracking by installing Google’s opt-out browser add-on or
                disabling cookies in your browser settings.
              </p>
            </div>

            {/* Section: Cookies */}
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p>
                Cookies are small text files placed on your device to help our
                website recognize you on return visits and to understand your
                preferences. We use cookies for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-6 mt-2">
                <li>
                  Authentication and security—keeping you logged in as you
                  navigate.
                </li>
                <li>
                  Performance and functionality—remembering language or currency
                  preferences.
                </li>
                <li>
                  Analytics and research—tracking page views and click behavior
                  for site improvement.
                </li>
                <li>
                  Marketing—displaying relevant offers and content based on your
                  interests.
                </li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. Disabling
                cookies may limit certain features, but essential functions like
                booking forms will still work.
              </p>
            </div>

            {/* Section: External Links */}
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">
                External Links
              </h2>
              <p>
                Our site may contain links to third-party websites, such as
                travel partners or government permit portals. This Privacy
                Policy does not apply to those external sites. We encourage you
                to review their privacy policies before sharing personal data
                with them.
              </p>
            </div>

            {/* Section: Policy Updates */}
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">
                Policy Updates and Contact
              </h2>
              <p>
                We may update this Privacy Policy periodically to reflect
                changes in our practices or for legal reasons. When we make
                changes, we will revise the “Last Updated” date at the top of
                this page and notify you if required by law.
              </p>
              <p className="mt-4">
                If you have any questions, concerns, or requests regarding your
                personal data or this policy, please contact our Data Protection
                Officer at:
                <br />
                <a
                  href="mailto:privacy@evertreknepal.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@evertreknepal.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      /
    </main>
  );
}
