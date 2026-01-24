// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation, // ← added
} from "react-router-dom";
import Home from "./home/Home";

import Footer from "./home/Footer";
// import EverestTrekIndex from "./treks/regions/everest";
import AnnapurnaLuxuryPage from "./treks/regions/Annapurna-Index";
import TrekkingInNepalPage from "./pages/Trekking-in-Nepal";
import RegionCard from "./treks/regions/Regions-Card";
import EverestTrekIndex from "./treks/regions/Everest-Index";
import ContactUsPage from "./pages/Contact-Us";
import CostAndDate from "./treks/trekkingpage/Datesandprice";
import AboutUsPage from "./pages/About-Us";
import ScrollToTop from "./pages/Scroll-Top";
import SinglePageBookingForm from "./Book/TrekBooking/TrekBooking";
//
import ForgotPassword from "./Profile/Login/ForgetPassword"

import CustomizeTripPage from "./Book/Customize-trip/CutomizeTrips";
// import TrekMap from "./treks/trekkingpage/TrekMap";

import TravelIndex from "./travel-info/Travel-items.jsx";
import VisaInformationPage from "./travel-info/Visa-Info.jsx";
import HealthSafetyPage from "./travel-info/Health-Safety.jsx";
import PackingInformationPage from "./travel-info/Packing-List.jsx";
import TransportationPage from "./travel-info/Trasnportation.jsx";
import FAQPage from "./travel-info/FAQs.jsx";
import PaymentGuide from "./About us/How-to-make-a-payment.jsx";
import PrivacyPolicyPage from "./About us/Policy.jsx";
import LegalDocumentsPage from "./About us/LegalDocument.jsx";
import OurTeamPage from "./About us/Ourteam.jsx";
import OverviewPage from "./pages/About-Us";
import TrekOverview from "./treks/trekkingpage/TrekOverview.jsx";
import ImprovedNavbar from "./navbarEssentials/Navbar.jsx";
import BlogPage from "./blog/Blogs.jsx";
import BlogDetails from "./blog/BlogDetails.jsx";
import "./index.css";



import { BreadcrumbVisibilityProvider } from "./components/Breadcrumb/BreadcrumbVisibilityContext";
import PageBreadcrumbs from "./components/Breadcrumb/PageBreadcrumbs";

// NEW IMPORTS - Chatbot

// TOurs events
import ToursPage from "./Travel-Activities/Tour-Activities/Tours.jsx";
import JungleSafariPage from "./Travel-Activities/JungleSafari/Jungle.jsx";
import BikeRentalPage from "./Travel-Activities/BikeRental/Biker.jsx";
import Tours from "./Travel-Activities/Tour-Activities/Tours.jsx";
import TourDetail from "./Travel-Activities/Tour-Activities/Tour-Detailed.jsx";
import TrekDetailPage from "./treks/TreksDetailPage.jsx";

import LangtangTrek from "./treks/regions/Lantang-Index.jsx";
import ManasluTrek from "./treks/regions/Manaslu-Index.jsx";
import MustangTrek from "./treks/regions/Mustang-Index.jsx";
import Navbar from "./navbarEssentials/Navbar.jsx";
import EverTrekChatbot from "./AI chatbot/EverTrek.Chatbot.jsx";
import LoginForm from "./Profile/Login/LoginForm.jsx";
import RegisterForm from "./Profile/Login/RegisterForm.jsx";
import VerifyOtp from "./Profile/Login/VerrifyOTP.jsx";
import DataPreloader from "./PreLoader/Loader.jsx";
import CustomizeTrekPage from "./Book/Customize-trip/CutomizeTrips";
import BookingDetailPage from "./Profile/ProfileData/BookingDetailPage";
import { getAccessToken } from "./api/auth/auth.api";
import Profile from "./Profile/Profile";
import MyBookingsPage from "./Profile/ProfileData/MyBookingPage";
import PaymentPage from "./Book/TrekBooking/PaymentPage";
import PaymentSuccessPage from "./Book/TrekBooking/PaymentSuccessPage";
import CustomizeTripSuccess from "./Book/Customize-trip/CustomizeTripSuccess";

// Layout component that shows Navbar/Footer + Chatbot on every page
const Layout = () => (
  <><BreadcrumbVisibilityProvider>
    {/* <ImprovedNavbar /> */}
    <Navbar />
    <main className="min-h-[calc(100vh-8rem)]">

      <PageBreadcrumbs />
      {/* Outlet renders the matching child route */}
      <Outlet />
    </main>
    <Footer />
    {/* CHATBOT - Visible on ALL pages */}
    <EverTrekChatbot />
  </BreadcrumbVisibilityProvider></>
);

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const token = getAccessToken(); // ✅ SAME SOURCE

  if (!token) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
};
const App = () => (
  <Router>
    <ScrollToTop />
    <DataPreloader />

    {/* Wrap everything in a Router to enable routing */}
    <Routes>
      {/* All routes under "/" will render inside Layout */}
      <Route path="/" element={<Layout />}>
        {/* index → renders at "/" */}
        <Route index element={<Home />} />
        <Route path="/trekking-in-nepal" element={<TrekkingInNepalPage />} />
        {/* <Route path="trekcard" element={<TrekCard />} /> */}
        <Route path="/travel-styles" element={<Tours />} />


        <Route path="/treks/everest-treks" element={<EverestTrekIndex />} />
        <Route path="annapurna-treks" element={<AnnapurnaLuxuryPage />} />
        <Route path="langtang" element={<LangtangTrek />} />



        {/* your existing trek detail route */}
        {/* "/treks" → overview with your RegionsIndex */}
        {/* <Route path="treks" element={<TrekkingInNepalPage />} /> */}
        <Route path="trekdetailpage" element={<TrekDetailPage />} />
        <Route path="trekdetailpage/:id" element={<TrekDetailPage />} />
        <Route path="trekking-in-nepal" element={<TrekkingInNepalPage />} />
        {/* <Route path="regions-card" element={<RegionCard />} /> */}
        {/* <Route path="customize-trip" element={<CustomizeTripPage />} /> */}
        <Route path="/trek/:id" element={<TrekDetailPage />} />
        {/* <Route path="/trek-booking" element={<BookingPage />} /> */}
        <Route path="/about-us" element={<AboutUsPage />} />


        {/* ADD THESE TRAVEL INFO ROUTES */}
        <Route path="/travel-info" element={<TravelIndex />} />
        <Route
          path="/travel-info/visa-information"
          element={<VisaInformationPage />}
        />
        <Route
          path="/travel-info/health-safety"
          element={<HealthSafetyPage />}
        />
        <Route
          path="/travel-info/packing-list"
          element={<PackingInformationPage />}
        />
        <Route
          path="/travel-info/transportation"
          element={<TransportationPage />}
        />
        <Route path="/travel-info/faqs" element={<FAQPage />} />


        {/* region-specific */}
        <Route path="/treks/:region/:slug" element={<TrekDetailPage />} />
        <Route path="treks/everest" element={<EverestTrekIndex />} />
        <Route path="/everest/:slug" element={<TrekDetailPage />} />
        <Route path="/treks/annapurna" element={<AnnapurnaLuxuryPage />} />
        <Route path="/annapurna/:slug" element={<TrekDetailPage />} />
        <Route path="/treks/manaslu" element={<ManasluTrek />} />
        <Route path="/manaslu/:slug" element={<TrekDetailPage />} />
        <Route path="/treks/mustang" element={<MustangTrek />} />
        <Route path="/mustang/:slug" element={<TrekDetailPage />} />
        <Route path="/treks/langtang" element={<LangtangTrek />} />
        <Route path="/langtang/:slug" element={<TrekDetailPage />} />
        {/* <Route path="/booking" element={<BookingPage />} /> */}
        <Route path="/customize-trek" element={<CustomizeTrekPage />} />

        <Route
          path="/travel-activities/jungle-safari"
          element={<JungleSafariPage />}
        />
        <Route path="/travel-activities/tours" element={<ToursPage />} />
        <Route path="/travel-activities/tours/:slug" element={<TourDetail />} />
        <Route path="/travel-styles/bike-rental" element={<BikeRentalPage />} />
        {/* <Route
          path="/everest-base-camp"
          element={<Itinerary days={everestBaseCamp.itinerary} />}
        /> */}
        {/* <Route path="/trekdetailpage" element={<TrekDescription />} /> */}
        <Route path="/trekdetailpage" element={<CostAndDate />} />
        <Route path="/treks/:slug" element={<TrekDetailPage />} />


        {/* catch-all: any /tours/:slug →  */}
        <Route path="/treks/:region/:slug" element={<TrekDetailPage />} />
        <Route path="/everest/:trekId" element={<TrekDetailPage />} />
        <Route path="/about-us/*" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
            <Route
          path="/customize-trip/success/:requestId"
          element={<CustomizeTripSuccess />}
        />
        <Route path="/trek-overview" element={<TrekOverview />} />

            <Route
          path="/trek-booking"
          element={
            <RequireAuth>
              <SinglePageBookingForm />
            </RequireAuth>
          }
        />
        <Route
          path="/payment"
          element={
            <RequireAuth>
              <PaymentPage />
            </RequireAuth>
          }
        />

            <Route
          path="/payment/success"
          element={
            <RequireAuth>
              <PaymentSuccessPage />
            </RequireAuth>
          }
        />
<Route
  path="/bookings"
  element={
    <RequireAuth>
      <MyBookingsPage />
    </RequireAuth>
  }
/>

<Route
  path="/bookings/:bookingRef"
  element={
    <RequireAuth>
      <BookingDetailPage />
    </RequireAuth>
  }
/>


        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about-us" element={<OverviewPage />} />
        <Route path="/about-us/our-team" element={<OurTeamPage />} />
        <Route
          path="/about-us/how-to-make-a-payment"
          element={<PaymentGuide />}
        />
        <Route
          path="/about-us/privacy-policy"
          element={<PrivacyPolicyPage />}
        />
        <Route
          path="/about-us/legal-documents"
          element={<LegalDocumentsPage />}
        />
        {/* optional: global 404 → home */}
        <Route path="*" element={<Navigate to="/" replace />} />


        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route path="/blog/:slug/details" element={<BlogDetails />} />
        <Route path="/jungle-safari" element={<JungleSafariPage />} />
        <Route path="/bike-rental" element={<BikeRentalPage />} />
        <Route path="/trekking-in-nepal" element={<TrekkingInNepalPage />} />
        <Route path="/trekking-in-nepal/:slug" element={<TrekDetailPage />} />
        <Route
          path="/trekking-in-nepal/:region/:slug"
          element={<TrekDetailPage />}
        />
        <Route
          path="/trekking-in-nepal/:region/:slug/:trekId"
          element={<TrekDetailPage />}
        />

        {/* Data Loader */}


        {/* Login */}
        <Route path="/login" element={<LoginForm modal />} />
        <Route path="/register" element={<RegisterForm modal />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />



      </Route>
    </Routes>
  </Router>
);

export default App;
