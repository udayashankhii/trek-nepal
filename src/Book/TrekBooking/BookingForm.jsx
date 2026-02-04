// // src/components/BookingForm.jsx
// import React from "react";
// import {
//   Calendar,
//   Users,
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   Plane,
// } from "lucide-react";
// import {
//   InputField,
//   SelectField,
//   TextareaField,
//   SectionContainer,
//   TravellerCounter,
//   SubmitButton,
// } from "./FormComponents.jsx";

// /**
//  * ✅ FIXED: Form Header Component - No more "book undefined"
//  */
// export function FormHeader({
//   title = "Book Your Adventure",
//   subtitle = "Complete your booking in one simple form",
// }) {
//   return (
//     <div className="text-center mb-8">
//       <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
//       <p className="text-gray-600">{subtitle}</p>
//     </div>
//   );
// }

// /**
//  * Trip Details Section - Dates and Traveller Count
//  */
// export function TripDetailsSection({
//   startDate,
//   setStartDate,
//   endDate,
//   travellers,
//   setTravellers,
//   duration,
// }) {
//   return (
//     <SectionContainer Icon={Calendar} title="Trek Details">
//       <div className="grid md:grid-cols-2 gap-6 mb-6">
//         <InputField
//           label="Departure Date"
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           min={new Date().toISOString().split("T")[0]}
//           required
//           Icon={Calendar}
//         />
//         <InputField
//           label="Return Date"
//           type="date"
//           value={endDate}
//           readOnly
//           Icon={Calendar}
//           helperText={`Automatically calculated (${duration || "N/A"})`}
//         />
//       </div>

//       <TravellerCounter travellers={travellers} setTravellers={setTravellers} />
//     </SectionContainer>
//   );
// }

// /**
//  * Personal Information Section - Contact and Details
//  */
// export function PersonalInfoSection({
//   lead,
//   changeLead,
//   countryList,
//   validation,
// }) {
//   const titleOptions = ["Mr.", "Ms.", "Mrs.", "Dr."];
//   const experienceOptions = [
//     { value: "beginner", label: "Beginner" },
//     { value: "intermediate", label: "Intermediate" },
//     { value: "advanced", label: "Advanced" },
//     { value: "expert", label: "Expert" },
//   ];

//   return (
//     <SectionContainer
//       Icon={Users}
//       title="Personal Information"
//       gradientFrom="blue-50"
//       gradientTo="indigo-50"
//     >
//       {/* Title and Experience */}
//       <div className="grid md:grid-cols-2 gap-6 mb-6">
//         <SelectField
//           label="Title"
//           name="title"
//           value={lead.title}
//           onChange={changeLead}
//           options={titleOptions}
//         />
//         <SelectField
//           label="Experience Level"
//           name="experience"
//           value={lead.experience}
//           onChange={changeLead}
//           options={experienceOptions}
//         />
//       </div>

//       {/* Name Fields */}
//       <div className="grid md:grid-cols-2 gap-6 mb-6">
//         <InputField
//           label="First Name"
//           name="firstName"
//           value={lead.firstName}
//           onChange={changeLead}
//           placeholder="Enter your first name"
//           required
//         />
//         <InputField
//           label="Last Name"
//           name="lastName"
//           value={lead.lastName}
//           onChange={changeLead}
//           placeholder="Enter your last name"
//           required
//         />
//       </div>

//       {/* Email and Phone */}
//       <div className="grid md:grid-cols-2 gap-6 mb-6">
//         <InputField
//           label="Email Address"
//           name="email"
//           type="email"
//           value={lead.email}
//           onChange={changeLead}
//           placeholder="your@email.com"
//           required
//           Icon={Mail}
//           error={
//             validation.showEmailError
//               ? "Please enter a valid email address"
//               : ""
//           }
//         />
//         <InputField
//           label="Phone Number"
//           name="phone"
//           type="tel"
//           value={lead.phone}
//           onChange={changeLead}
//           placeholder="+1 (555) 123-4567"
//           required
//           Icon={Phone}
//           error={
//             validation.showPhoneError
//               ? "Please enter a valid phone number with country code"
//               : ""
//           }
//         />
//       </div>

//       {/* Country */}
//       <SelectField
//         label="Country (Optional)"
//         name="country"
//         value={lead.country}
//         onChange={changeLead}
//         options={countryList.map((c) => ({ value: c.name, label: c.name }))}
//         Icon={MapPin}
//         placeholder="Select your country"
//         className="mb-6"
//       />

//       {/* Emergency Contact */}
//       <InputField
//         label="Emergency Contact"
//         name="emergencyContact"
//         value={lead.emergencyContact}
//         onChange={changeLead}
//         placeholder="Name and phone number of emergency contact"
//         className="mb-6"
//       />

//       {/* Dietary and Medical */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <InputField
//           label="Dietary Requirements"
//           name="dietaryReqs"
//           value={lead.dietaryReqs}
//           onChange={changeLead}
//           placeholder="Vegetarian, allergies, etc."
//         />
//         <InputField
//           label="Medical Conditions"
//           name="medicalConditions"
//           value={lead.medicalConditions}
//           onChange={changeLead}
//           placeholder="Any relevant medical information"
//         />
//       </div>
//     </SectionContainer>
//   );
// }

// /**
//  * Additional Information Section - Special Requests
//  */
// export function AdditionalInfoSection({ preferences, changePreferences }) {
//   return (
//     <SectionContainer
//       title="Additional Information"
//       gradientFrom="green-50"
//       gradientTo="emerald-50"
//     >
//       <TextareaField
//         label="Special Requests"
//         name="specialRequests"
//         value={preferences.specialRequests}
//         onChange={changePreferences}
//         placeholder="Any special requests or additional information..."
//         className="mb-6"
//       />

//       <TextareaField
//         label="Comments or Questions"
//         name="comments"
//         value={preferences.comments || ""}
//         onChange={(e) =>
//           changePreferences({
//             target: { name: "comments", value: e.target.value },
//           })
//         }
//         placeholder="Any comments or questions you have about your trek..."
//       />
//     </SectionContainer>
//   );
// }

// /**
//  * Travel Times Section - Nepal Arrival/Departure
//  */
// export function TravelTimesSection({
//   departureTime,
//   setDepartureTime,
//   returnTime,
//   setReturnTime,
//   formatNepalTime,
// }) {
//   return (
//     <SectionContainer
//       Icon={Plane}
//       title="Nepal Travel Times"
//       gradientFrom="purple-50"
//       gradientTo="pink-50"
//       iconColor="purple-600"
//       subtitle="If you need assistance with travel arrangements to/from Nepal, please provide your preferred times."
//     >
//       <div className="grid md:grid-cols-2 gap-6">
//         <div>
//           <InputField
//             label="Departure Time to Nepal"
//             type="time"
//             value={departureTime}
//             onChange={(e) => setDepartureTime(e.target.value)}
//             Icon={Clock}
//           />
//           {departureTime && (
//             <p className="text-xs text-purple-600 font-medium mt-2">
//               Nepal Time: {formatNepalTime(departureTime)}
//             </p>
//           )}
//         </div>

//         <div>
//           <InputField
//             label="Return Time from Nepal"
//             type="time"
//             value={returnTime}
//             onChange={(e) => setReturnTime(e.target.value)}
//             Icon={Clock}
//           />
//           {returnTime && (
//             <p className="text-xs text-purple-600 font-medium mt-2">
//               Nepal Time: {formatNepalTime(returnTime)}
//             </p>
//           )}
//         </div>
//       </div>
//     </SectionContainer>
//   );
// }

// /**
//  * Terms and Submit Section
//  */
// export function TermsAndSubmitSection({
//   accepted,
//   setAccepted,
//   formValid,
//   submitting = false,
// }) {
//   return (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         <label className="flex items-start space-x-3 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={accepted}
//             onChange={(e) => setAccepted(e.target.checked)}
//             className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
//             required
//           />
//           <span className="text-sm text-gray-700">
//             I agree to the{" "}
//             <a
//               href="/terms"
//               className="text-indigo-600 underline hover:text-indigo-800"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Terms & Conditions
//             </a>{" "}
//             and{" "}
//             <a
//               href="/privacy"
//               className="text-indigo-600 underline hover:text-indigo-800"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Privacy Policy
//             </a>
//             <span className="text-red-500 ml-1">*</span>
//           </span>
//         </label>
//       </div>

//       <SubmitButton formValid={formValid} submitting={submitting} />
//     </div>
//   );
// }



// src/components/BookingForm.jsx
import React from "react";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  Plane,
} from "lucide-react";
import {
  InputField,
  SelectField,
  TextareaField,
  SectionContainer,
  TravellerCounter,
  SubmitButton,
} from "./FormComponents.jsx";


/**
 * ✅ FIXED: Form Header Component - No more "book undefined"
 */
export function FormHeader({
  title = "Book Your Adventure",
  subtitle = "Complete your booking in one simple form",
}) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}


/**
 * Trip Details Section - Dates and Traveller Count
 */
export function TripDetailsSection({
  startDate,
  setStartDate,
  endDate,
  travellers,
  setTravellers,
  duration,
}) {
  return (
    <SectionContainer Icon={Calendar} title="Trek Details">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <InputField
          label="Departure Date"
          type="text"
          value={startDate}
          readOnly
          Icon={Calendar}
          helperText="Automatically selected"
        />
        <InputField
          label="Return Date"
          type="text"
          value={endDate}
          readOnly
          Icon={Calendar}
          helperText={`Automatically calculated (${duration || "N/A"})`}
        />
      </div>


      <TravellerCounter travellers={travellers} setTravellers={setTravellers} />
    </SectionContainer>
  );
}


/**
 * Personal Information Section - Contact and Details
 */
export function PersonalInfoSection({
  lead,
  changeLead,
  countryList,
  validation,
}) {
  const titleOptions = ["Mr.", "Ms.", "Mrs.", "Dr."];
  const experienceOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];


  return (
    <SectionContainer
      Icon={Users}
      title="Personal Information"
      gradientFrom="blue-50"
      gradientTo="indigo-50"
    >
      {/* Title and Experience */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <SelectField
          label="Title"
          name="title"
          value={lead.title}
          onChange={changeLead}
          options={titleOptions}
        />
        <SelectField
          label="Experience Level"
          name="experience"
          value={lead.experience}
          onChange={changeLead}
          options={experienceOptions}
        />
      </div>


      {/* Name Fields */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <InputField
          label="First Name"
          name="firstName"
          value={lead.firstName}
          onChange={changeLead}
          placeholder="Enter your first name"
          required
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={lead.lastName}
          onChange={changeLead}
          placeholder="Enter your last name"
          required
        />
      </div>


      {/* Email and Phone */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={lead.email}
          onChange={changeLead}
          placeholder="your@email.com"
          required
          Icon={Mail}
          error={
            validation.showEmailError
              ? "Please enter a valid email address"
              : ""
          }
        />
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          value={lead.phone}
          onChange={changeLead}
          placeholder="+1 (555) 123-4567"
          required
          Icon={Phone}
          error={
            validation.showPhoneError
              ? "Please enter a valid phone number with country code"
              : ""
          }
        />
      </div>


      {/* Country */}
      <SelectField
        label="Country (Optional)"
        name="country"
        value={lead.country}
        onChange={changeLead}
        options={countryList.map((c) => ({ value: c.name, label: c.name }))}
        Icon={MapPin}
        placeholder="Select your country"
        className="mb-6"
      />


      {/* Emergency Contact */}
      <InputField
        label="Emergency Contact"
        name="emergencyContact"
        value={lead.emergencyContact}
        onChange={changeLead}
        placeholder="Name and phone number of emergency contact"
        className="mb-6"
      />


      {/* Dietary and Medical */}
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Dietary Requirements"
          name="dietaryReqs"
          value={lead.dietaryReqs}
          onChange={changeLead}
          placeholder="Vegetarian, allergies, etc."
        />
        <InputField
          label="Medical Conditions"
          name="medicalConditions"
          value={lead.medicalConditions}
          onChange={changeLead}
          placeholder="Any relevant medical information"
        />
      </div>
    </SectionContainer>
  );
}


/**
 * Additional Information Section - Special Requests
 */
export function AdditionalInfoSection({ preferences, changePreferences }) {
  return (
    <SectionContainer
      title="Additional Information"
      gradientFrom="green-50"
      gradientTo="emerald-50"
    >
      <TextareaField
        label="Special Requests"
        name="specialRequests"
        value={preferences.specialRequests}
        onChange={changePreferences}
        placeholder="Any special requests or additional information..."
        className="mb-6"
      />


      <TextareaField
        label="Comments or Questions"
        name="comments"
        value={preferences.comments || ""}
        onChange={(e) =>
          changePreferences({
            target: { name: "comments", value: e.target.value },
          })
        }
        placeholder="Any comments or questions you have about your trek..."
      />
    </SectionContainer>
  );
}


/**
 * Travel Times Section - Nepal Arrival/Departure
 */
export function TravelTimesSection({
  departureTime,
  setDepartureTime,
  returnTime,
  setReturnTime,
  formatNepalTime,
}) {
  return (
    <SectionContainer
      Icon={Plane}
      title="Nepal Travel Times"
      gradientFrom="purple-50"
      gradientTo="pink-50"
      iconColor="purple-600"
      subtitle="If you need assistance with travel arrangements to/from Nepal, please provide your preferred times."
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <InputField
            label="Departure Time to Nepal"
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            Icon={Clock}
          />
          {departureTime && (
            <p className="text-xs text-purple-600 font-medium mt-2">
              Nepal Time: {formatNepalTime(departureTime)}
            </p>
          )}
        </div>


        <div>
          <InputField
            label="Return Time from Nepal"
            type="time"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            Icon={Clock}
          />
          {returnTime && (
            <p className="text-xs text-purple-600 font-medium mt-2">
              Nepal Time: {formatNepalTime(returnTime)}
            </p>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}


/**
 * Terms and Submit Section
 */
export function TermsAndSubmitSection({
  accepted,
  setAccepted,
  formValid,
  submitting = false,
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
            required
          />
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <a
              href="/terms"
              className="text-indigo-600 underline hover:text-indigo-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-indigo-600 underline hover:text-indigo-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
      </div>


      <SubmitButton formValid={formValid} submitting={submitting} />
    </div>
  );
}
