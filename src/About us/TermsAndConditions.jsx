// src/pages/TermsAndConditions.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  AlertCircle, 
  Shield, 
  CreditCard, 
  Calendar,
  Mountain,
  Heart,
  Scale,
  Home
} from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          </div>
          <p className="text-indigo-100 text-lg">
            Last Updated: February 7, 2026
          </p>
          <p className="text-indigo-100 mt-2">
            Please read these terms carefully before booking your trek with EverTrek Nepal
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          
          {/* Quick Navigation */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Quick Navigation
            </h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <a href="#acceptance" className="text-indigo-600 hover:underline">1. Acceptance of Terms</a>
              <a href="#booking" className="text-indigo-600 hover:underline">2. Booking & Reservations</a>
              <a href="#payment" className="text-indigo-600 hover:underline">3. Payment Terms</a>
              <a href="#cancellation" className="text-indigo-600 hover:underline">4. Cancellation & Refunds</a>
              <a href="#trek-conditions" className="text-indigo-600 hover:underline">5. Trek Conditions</a>
              <a href="#liability" className="text-indigo-600 hover:underline">6. Liability & Insurance</a>
              <a href="#responsibilities" className="text-indigo-600 hover:underline">7. User Responsibilities</a>
              <a href="#company-obligations" className="text-indigo-600 hover:underline">8. Company Obligations</a>
              <a href="#intellectual-property" className="text-indigo-600 hover:underline">9. Intellectual Property</a>
              <a href="#governing-law" className="text-indigo-600 hover:underline">10. Governing Law</a>
            </div>
          </div>

          {/* Section 1 */}
          <Section id="acceptance" icon={FileText} title="1. Acceptance of Terms">
            <p>
              By accessing and using EverTrek Nepal's website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
            <p>
              These terms apply to all users of the site, including browsers, customers, and contributors of content.
            </p>
          </Section>

          {/* Section 2 */}
          <Section id="booking" icon={Calendar} title="2. Booking & Reservations">
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">2.1 Booking Process</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>All bookings must be made through our official website or authorized agents</li>
              <li>A booking is confirmed only after receiving the initial deposit payment</li>
              <li>You will receive a booking confirmation email within 24 hours</li>
              <li>Minimum age requirement: 16 years (with parental consent for minors)</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">2.2 Booking Confirmation</h4>
            <p>
              Your booking is confirmed when:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You have completed the booking form with accurate information</li>
              <li>You have paid the required deposit (typically 100% of total cost)</li>
              <li>You have received written confirmation from EverTrek Nepal</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">2.3 Group Bookings</h4>
            <p>
              For group bookings (4+ people), special terms and discounts may apply. Contact us directly for group pricing.
            </p>
          </Section>

          {/* Section 3 */}
          <Section id="payment" icon={CreditCard} title="3. Payment Terms">
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">3.1 Payment Schedule</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Deposit:</strong> 100% of total trek cost due at booking</li>
             
            
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">3.2 Accepted Payment Methods</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Credit/Debit Cards (Visa, Mastercard, American Express)</li>
              <li>Bank Transfer</li>
              <li>PayPal</li>
            
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">3.3 Currency</h4>
            <p>
              All prices are quoted in USD unless otherwise stated. Prices may be subject to change due to currency fluctuations, but confirmed bookings are honored at the original quoted price.
            </p>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">3.4 Price Inclusions & Exclusions</h4>
            <p>
              Please refer to individual trek pages for detailed inclusions and exclusions. Generally excluded:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>International airfare</li>
              <li>Nepal entry visa fees</li>
              <li>Travel insurance</li>
              <li>Personal expenses (drinks, snacks, tips)</li>
              <li>Emergency evacuation costs</li>
            </ul>
          </Section>

          {/* Section 4 */}
          <Section id="cancellation" icon={AlertCircle} title="4. Cancellation & Refunds">
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">4.1 Cancellation by Customer</h4>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 my-4">
              <p className="font-semibold text-red-900 mb-2">Refund Schedule:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>60+ days before departure:</strong> 90% refund (10% admin fee)</li>
                <li>• <strong>30-59 days before departure:</strong> 50% refund</li>
                <li>• <strong>15-29 days before departure:</strong> 25% refund</li>
                <li>• <strong>Less than 15 days:</strong> No refund</li>
              </ul>
            </div>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">4.2 Cancellation by EverTrek Nepal</h4>
            <p>
              We reserve the right to cancel any trek due to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Insufficient bookings (minimum 2 participants)</li>
              <li>Extreme weather conditions or natural disasters</li>
              <li>Political instability or safety concerns</li>
              <li>Force majeure events</li>
            </ul>
            <p className="mt-3">
              <strong>In case of our cancellation:</strong> You will receive a full refund or option to reschedule to another date at no additional cost.
            </p>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">4.3 Weather-Related Changes</h4>
            <p>
              Trek itineraries may be modified due to weather conditions for safety reasons. Such changes do not entitle customers to refunds, as safety is our priority.
            </p>
          </Section>

          {/* Section 5 */}
          <Section id="trek-conditions" icon={Mountain} title="5. Trek Conditions">
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">5.1 Physical Fitness Requirements</h4>
            <p>
              Trekking in Nepal requires good physical fitness. Customers must:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be in good health and physical condition</li>
              <li>Disclose any medical conditions that may affect the trek</li>
              <li>Obtain medical clearance if required</li>
              <li>Inform us of any dietary restrictions or allergies</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">5.2 Altitude Sickness</h4>
            <p>
              High-altitude trekking carries risks including Acute Mountain Sickness (AMS). We include acclimatization days in our itineraries, but customers must:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Understand the symptoms of altitude sickness</li>
              <li>Follow guide instructions regarding ascent pace</li>
              <li>Report any symptoms immediately</li>
              <li>Accept that descent may be necessary for safety</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">5.3 Weather & Trail Conditions</h4>
            <p>
              Mountain weather is unpredictable. EverTrek Nepal is not responsible for delays or itinerary changes due to weather, but will make reasonable efforts to maintain the schedule.
            </p>
          </Section>

          {/* Section 6 */}
          <Section id="liability" icon={Shield} title="6. Liability & Insurance">
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">6.1 Travel Insurance (Mandatory)</h4>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 my-4">
              <p className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Insurance Requirement
              </p>
              <p className="text-sm text-gray-700">
                All customers MUST have comprehensive travel insurance covering:
              </p>
              <ul className="space-y-1 text-sm text-gray-700 mt-2">
                <li>• Medical expenses and emergency treatment</li>
                <li>• Emergency helicopter evacuation (up to 6,000m altitude)</li>
                <li>• Trip cancellation and interruption</li>
                <li>• Personal accident and baggage loss</li>
              </ul>
            </div>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">6.2 Limitation of Liability</h4>
            <p>
              EverTrek Nepal acts as an organizer and agent for service providers (hotels, airlines, transport). We are not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acts of God, natural disasters, or force majeure events</li>
              <li>Personal injury or illness not caused by our negligence</li>
              <li>Loss or damage to personal belongings</li>
              <li>Third-party service provider failures</li>
              <li>Political unrest or government actions</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">6.3 Maximum Liability</h4>
            <p>
              Our maximum liability is limited to the total amount paid for your trek booking.
            </p>
          </Section>

          {/* Section 7 */}
          <Section id="responsibilities" icon={Heart} title="7. User Responsibilities">
            <p>By booking with EverTrek Nepal, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate personal and health information</li>
              <li>Obtain necessary visas and permits</li>
              <li>Follow guide instructions and safety protocols</li>
              <li>Respect local customs, culture, and environment</li>
              <li>Not engage in illegal activities</li>
              <li>Maintain adequate physical fitness for the trek</li>
              <li>Carry required personal equipment and medications</li>
              <li>Behave respectfully toward guides, porters, and fellow trekkers</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">Environmental Responsibility</h4>
            <p>
              We practice "Leave No Trace" principles. Customers must not litter and should minimize environmental impact.
            </p>
          </Section>

          {/* Section 8 */}
          <Section id="company-obligations" icon={Shield} title="8. Company Obligations">
            <p>EverTrek Nepal commits to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide experienced, licensed trekking guides</li>
              <li>Ensure safety equipment and first aid supplies are available</li>
              <li>Arrange accommodation and meals as per itinerary</li>
              <li>Obtain necessary trekking permits</li>
              <li>Provide porter services as specified in the package</li>
              <li>Maintain communication equipment for emergencies</li>
              <li>Fair treatment and proper compensation for staff and porters</li>
            </ul>
          </Section>

          {/* Section 9 */}
          <Section id="intellectual-property" icon={FileText} title="9. Intellectual Property">
            <p>
              All content on the EverTrek Nepal website, including text, images, logos, and itineraries, is protected by copyright and intellectual property laws.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Content may not be reproduced without written permission</li>
              <li>Trek photos may be used for marketing purposes unless you opt out</li>
              <li>Customer reviews and testimonials may be published</li>
            </ul>
          </Section>

          {/* Section 10 */}
          <Section id="governing-law" icon={Scale} title="10. Governing Law & Disputes">
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">10.1 Jurisdiction</h4>
            <p>
              These Terms and Conditions are governed by the laws of Nepal. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.
            </p>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">10.2 Dispute Resolution</h4>
            <p>
              We encourage customers to contact us directly to resolve any issues. If a resolution cannot be reached, disputes may be escalated through:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mediation through Nepal Tourism Board</li>
              <li>Arbitration in Kathmandu</li>
              <li>Legal proceedings as a last resort</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">10.3 Amendments</h4>
            <p>
              EverTrek Nepal reserves the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of our services constitutes acceptance of modified terms.
            </p>
          </Section>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mt-8">
            <h3 className="font-bold text-indigo-900 mb-3 text-lg">Questions About Our Terms?</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Email:</strong> info@evertreknepal.com</p>
              <p><strong>Phone:</strong> +977- 980-1234567</p>
              <p><strong>Address:</strong> Kathmandu, Nepal</p>
              <p><strong>Website:</strong> www.evertreknepal.com</p>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
            <h3 className="font-bold text-green-900 mb-2">Acknowledgment</h3>
            <p className="text-sm text-gray-700">
              By completing a booking with EverTrek Nepal, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. You also confirm that you meet all physical and health requirements for your chosen trek.
            </p>
          </div>

          {/* Action Buttons */}
      
        </div>
      </div>
    </div>
  );
}

// Reusable Section Component
function Section({ id, icon: Icon, title, children }) {
  return (
    <section id={id} className="scroll-mt-4">
      <div className="flex items-start gap-3 mb-4">
        {Icon && (
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-900 flex-1">{title}</h2>
      </div>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
