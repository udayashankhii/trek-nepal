

// src/App.jsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import SEO from "./components/common/SEO";
import Footer from "./home/Footer";
import ScrollToTop from "./pages/Scroll-Top";
import "./index.css";

import { BreadcrumbVisibilityProvider } from "./components/Breadcrumb/BreadcrumbVisibilityContext";
import PageBreadcrumbs from "./components/Breadcrumb/PageBreadcrumbs";

import Navbar from "./navbarEssentials/Navbar.jsx";
import EverTrekChatbot from "./AI chatbot/EverTrek.Chatbot.jsx";
import DataPreloader from "./PreLoader/Loader.jsx";
import { getAccessToken } from "./api/auth/auth.api";
import { useAuth } from "./api/auth/AuthContext";
import TopBar from "./navbarEssentials/Topnavbar";

const Home = lazy(() => import("./home/Home"));
const AnnapurnaLuxuryPage = lazy(() => import("./treks/regions/Annapurna-Index"));
const TrekkingInNepalPage = lazy(() => import("./pages/Trekking-in-Nepal"));
const EverestTrekIndex = lazy(() => import("./treks/regions/Everest-Index"));
const ContactUsPage = lazy(() => import("./pages/Contact-Us"));
const CostAndDate = lazy(() => import("./treks/trekkingpage/Datesandprice"));
const AboutUsPage = lazy(() => import("./pages/About-Us"));
const SinglePageBookingForm = lazy(() => import("./Book/TrekBooking/TrekBooking"));
const CustomizeTripPage = lazy(() => import("./Book/Customize-trip/CutomizeTrips"));
const TravelIndex = lazy(() => import("./travel-info/Travel-items.jsx"));
const VisaInformationPage = lazy(() => import("./travel-info/Visa-Info.jsx"));
const HealthSafetyPage = lazy(() => import("./travel-info/Health-Safety.jsx"));
const PackingInformationPage = lazy(() => import("./travel-info/Packing-List.jsx"));
const TransportationPage = lazy(() => import("./travel-info/Trasnportation.jsx"));
const FAQPage = lazy(() => import("./travel-info/FAQs.jsx"));
const PaymentGuide = lazy(() => import("./About us/How-to-make-a-payment.jsx"));
const PrivacyPolicyPage = lazy(() => import("./About us/Policy.jsx"));
const LegalDocumentsPage = lazy(() => import("./About us/LegalDocument.jsx"));
const OurTeamPage = lazy(() => import("./About us/Ourteam.jsx"));
const TrekOverview = lazy(() => import("./treks/trekkingpage/TrekOverview.jsx"));
const BlogPage = lazy(() => import("./blog/Blogs.jsx"));
const BlogDetails = lazy(() => import("./blog/BlogDetails.jsx"));
const ToursPage = lazy(() => import("./Travel-Activities/Tour-Activities/Tours.jsx"));
const JungleSafariPage = lazy(() => import("./Travel-Activities/JungleSafari/Jungle.jsx"));
const BikeRentalPage = lazy(() => import("./Travel-Activities/BikeRental/Biker.jsx"));
const Tours = lazy(() => import("./Travel-Activities/Tour-Activities/Tours.jsx"));
const TourDetail = lazy(() => import("./Travel-Activities/Tour-Activities/Tour-Detailed.jsx"));
const TrekDetailPage = lazy(() => import("./treks/TreksDetailPage.jsx"));
const LangtangTrek = lazy(() => import("./treks/regions/Lantang-Index.jsx"));
const ManasluTrek = lazy(() => import("./treks/regions/Manaslu-Index.jsx"));
const MustangTrek = lazy(() => import("./treks/regions/Mustang-Index.jsx"));
const CustomizeTrekPage = lazy(() => import("./Book/Customize-trip/CutomizeTrips"));
const BookingDetailPage = lazy(() => import("./Profile/ProfileData/BookingDetailPage"));
const Profile = lazy(() => import("./Profile/Profile"));
const MyBookingsPage = lazy(() => import("./Profile/ProfileData/MyBookingPage"));
const PaymentPage = lazy(() => import("./Book/TrekBooking/PaymentPage"));
const PaymentSuccessPage = lazy(() => import("./Book/TrekBooking/PaymentSuccessPage"));
const CustomizeTripSuccess = lazy(() => import("./Book/Customize-trip/CustomizeTripSuccess"));
const LoginModal = lazy(() => import("./Model/LoginModal.jsx"));
const RegisterModal = lazy(() => import("./Model/RegisterModal.jsx"));
const ForgotPasswordModal = lazy(() => import("./Model/ForgotPasswordModal.jsx"));
const VerifyOtpModal = lazy(() => import("./Model/VerifyOtpModal.jsx"));
const TermsAndConditions = lazy(() => import("./About us/TermsAndConditions"));

// Layout component that shows Navbar/Footer + Chatbot on every page
const Layout = () => (
  <>
    <BreadcrumbVisibilityProvider>
      <SEO />
       <TopBar />
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
    console.log('🚫 No token, redirecting to login modal');
    return (
      <Navigate
        to="/login"
        state={{
          backgroundLocation: location,
          next: location.pathname + location.search,
        }}
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

  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
            Loading...
          </div>
        }
      >
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
            <Route
              path="/customize-trek"
              element={
                <RequireAuth>
                  <CustomizeTrekPage />
                </RequireAuth>
              }
            />

            <Route
              path="/travel-activities/jungle-safari"
              element={<JungleSafariPage />}
            />
            <Route path="/travel-activities/tours" element={<ToursPage />} />
            <Route path="/travel-activities/tours/:slug" element={<TourDetail />} />
            <Route path="/travel-styles/bike-rental" element={<BikeRentalPage />} />
            <Route path="/trekdetailpage" element={<CostAndDate />} />
            <Route path="/treks/:slug" element={<TrekDetailPage />} />
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
            <Route path="/trekking-in-nepal/:slug" element={<TrekDetailPage />} />
            <Route
              path="/trekking-in-nepal/:region/:slug"
              element={<TrekDetailPage />}
            />
            <Route
              path="/trekking-in-nepal/:region/:slug/:trekId"
              element={<TrekDetailPage />}
            />

            <Route path="/register" element={null} /> {/* Handled by modal overlay */}
            <Route path="/login" element={null} /> {/* Handled by modal overlay */}
            <Route path="/verify-otp" element={null} /> {/* Handled by modal overlay */}
            <Route path="/forgot-password" element={null} /> {/* Handled by modal overlay */}
            <Route path="/profile" element={<Profile />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>

        {/* Modal overlay routes - always rendered on top when path matches */}
        <Routes>
          <Route path="/login" element={<LoginModal />} />
          <Route path="/register" element={<RegisterModal />} />
          <Route path="/forgot-password" element={<ForgotPasswordModal />} />
          <Route path="/verify-otp" element={<VerifyOtpModal />} />
        </Routes>
      </Suspense>
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
