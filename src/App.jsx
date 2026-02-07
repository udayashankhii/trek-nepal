

// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import SEO from "./components/common/SEO";
import Home from "./home/Home";

import Footer from "./home/Footer";
import AnnapurnaLuxuryPage from "./treks/regions/Annapurna-Index";
import TrekkingInNepalPage from "./pages/Trekking-in-Nepal";
import RegionCard from "./treks/regions/Regions-Card";
import EverestTrekIndex from "./treks/regions/Everest-Index";
import ContactUsPage from "./pages/Contact-Us";
import CostAndDate from "./treks/trekkingpage/Datesandprice";
import AboutUsPage from "./pages/About-Us";
import ScrollToTop from "./pages/Scroll-Top";
import SinglePageBookingForm from "./Book/TrekBooking/TrekBooking";
import ForgotPassword from "./Profile/Login/ForgetPassword";

import CustomizeTripPage from "./Book/Customize-trip/CutomizeTrips";

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
import LoginForm from "./Profile/Login/LoginForm";
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
import LoginModal from "./Model/LoginModal.jsx";
import { useAuth } from "./api/auth/AuthContext";
import TermsAndConditions from "./About us/TermsAndConditions";

// Layout component that shows Navbar/Footer + Chatbot on every page
const Layout = () => (
  <>
    <BreadcrumbVisibilityProvider>
      <SEO />
      <Navbar />
      <main className="min-h-[calc(100vh-8rem)]">
        <PageBreadcrumbs />
        <Outlet />
      </main>
      <Footer />
      <EverTrekChatbot />
    </BreadcrumbVisibilityProvider>
  </>
);

// In App.jsx - update RequireAuth
const RequireAuth = ({ children }) => {
  const location = useLocation();
  const { isLoading } = useAuth(); // ✅ Use context for loading state
  const token = getAccessToken(); // ✅ Check token for auth

  console.log('🛡️ RequireAuth check:', {
    path: location.pathname,
    hasToken: !!token,
    isLoading
  });

  // ✅ Wait for auth to initialize (prevents flash of redirect)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    console.log('🚫 No token, redirecting to login');
    return (
      <Navigate
        to="/login"
        state={{ backgroundLocation: location }}
        replace
      />
    );
  }

  console.log('✅ Token found, rendering protected content');
  return children;
};


const AppRoutes = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  // ✅ Don't show modal if we're already at the target page
  const showModal = backgroundLocation && location.pathname === '/login';

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/trekking-in-nepal" element={<TrekkingInNepalPage />} />
          <Route path="/travel-styles" element={<Tours />} />

          <Route path="/treks/everest-treks" element={<EverestTrekIndex />} />
          <Route path="annapurna-treks" element={<AnnapurnaLuxuryPage />} />
          <Route path="langtang" element={<LangtangTrek />} />

          <Route path="trekdetailpage" element={<TrekDetailPage />} />
          <Route path="trekdetailpage/:id" element={<TrekDetailPage />} />
          <Route path="trekking-in-nepal" element={<TrekkingInNepalPage />} />
          <Route path="/trek/:id" element={<TrekDetailPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />

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
          <Route path="/customize-trek" element={<CustomizeTrekPage />} />

          <Route
            path="/travel-activities/jungle-safari"
            element={<JungleSafariPage />}
          />
          <Route path="/travel-activities/tours" element={<ToursPage />} />
          <Route path="/travel-activities/tours/:slug" element={<TourDetail />} />
          <Route path="/travel-styles/bike-rental" element={<BikeRentalPage />} />
          <Route path="/trekdetailpage" element={<CostAndDate />} />
          <Route path="/treks/:slug" element={<TrekDetailPage />} />

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
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

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

          <Route path="/register" element={<RegisterForm modal />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      {/* Modal routes - rendered on top of background */}
      {backgroundLocation && (
        <Routes>
          <Route path="/login" element={<LoginModal />} />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <Router>
    <ScrollToTop />
    <DataPreloader />
    <AppRoutes />
  </Router>
);

export default App;
