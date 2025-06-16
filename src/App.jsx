// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate, // ← added
} from "react-router-dom";

import Home from "./home/Home";
import TourCard from "./tours/TourCard";
import TourIndexPage from "./tours/TourPage";
import Navbar from "./home/Navbar";
import Footer from "./home/Footer";
import TrekCard from "./treks/TrekCard.jsx";
import TrekDetailPage from "./treks/trekkingpage/TreksDetailPage";
// import EverestTrekIndex from "./treks/regions/everest";
import AnnapurnaLuxuryPage from "./treks/regions/Annapurna-Index";
import TrekkingInNepalPage from "./pages/Trekking-in-Nepal";
import RegionCard from "./treks/regions/Regions-Card";
import EverestTrekIndex from "./treks/regions/Everest-Index";
import ContactUsPage from "./pages/Contact-Us";
// import CustomizeTripPage from "./Book/Customize-trip/CutomizeTrips";
// import BookingPage from "./Book/TripsBook/TrekBooking";
import CostAndDate from "./treks/trekkingpage/Datesandprice";
import everestBaseCamp from "./data/everestBaseCamp";
import Itinerary from "./treks/trekkingpage/Itinerary";
import AboutUsPage from "./pages/About-Us";
import ScrollToTop from "./pages/Scroll-Top";
import AboutUsDropdown from "./About us/About-us";
import BookingPage from "./Book/Customize-trip/TrekBooking";
import CustomizeTripPage from "./Book/Customize-trip/CutomizeTrips";
import TrekActions from "./treks/trekkingpage/TrekAction.jsx";
// import TrekMap from "./treks/trekkingpage/TrekMap";
import ElevationChart from "./treks/trekkingpage/ElevationChart";
import KeyInfo from "./treks/trekkingpage/Info.jsx";
import TravelIndex from "./travel-info/Travel-items.jsx";
import VisaInformationPage from "./travel-info/Visa-Info.jsx";
import HealthSafetyPage from "./travel-info/Health-Safety.jsx";
import PackingInformationPage from "./travel-info/Packing-List.jsx";
import TransportationPage from "./travel-info/Trasnportation.jsx";
import FAQPage from "./travel-info/FAQs.jsx";
import BlogPage from "./blog/Blogs.jsx";
import PaymentGuide from "./About us/How-to-make-a-payment.jsx";
import PrivacyPolicyPage from "./About us/Policy.jsx";
import LegalDocumentsPage from "./About us/LegalDocument.jsx";
import OurTeamPage from "./About us/Ourteam.jsx";
import OverviewPage from "./pages/About-Us";
import TrekOverview from "./treks/trekkingpage/TrekOverview.jsx";

// Layout component that shows Navbar/Footer on every page
const Layout = () => (
  <>
    <Navbar />
    <main className="min-h-[calc(100vh-8rem)]">
      {/* Outlet renders the matching child route */}
      <Outlet />
    </main>
    <Footer />
  </>
);

const App = () => (
  <Router>
    <ScrollToTop />
    {/* Wrap everything in a Router to enable routing */}
    <Routes>
      {/* All routes under “/” will render inside Layout */}
      <Route path="/" element={<Layout />}>
        {/* index → renders at “/” */}
        <Route index element={<Home />} />
        <Route path="/trekking-in-nepal" element={<TrekkingInNepalPage />} />
        {/* <Route path="trekcard" element={<TrekCard />} /> */}
        <Route path="tourcard" element={<TourCard />} />
        <Route path="tourindex" element={<TourIndexPage />} />
        <Route path="/treks/everest-treks" element={<EverestTrekIndex />} />
        <Route path="annapurna-treks" element={<AnnapurnaLuxuryPage />} />

        {/* your existing trek detail route */}
        {/* “/treks” → overview with your RegionsIndex */}
        {/* <Route path="treks" element={<TrekkingInNepalPage />} /> */}
        <Route path="trekdetailpage" element={<TrekDetailPage />} />
        <Route path="trekdetailpage/:id" element={<TrekDetailPage />} />
        <Route path="trekking-in-nepal" element={<TrekkingInNepalPage />} />
        {/* <Route path="regions-card" element={<RegionCard />} /> */}
        {/* <Route path="customize-trip" element={<CustomizeTripPage />} /> */}
        <Route path="/trek/:id" element={<TrekDetailPage />} />
        {/* <Route path="/trip-booking" element={<BookingPage />} /> */}
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
        <Route path="/annapurna/:trekId" element={<TrekDetailPage />} />
        <Route path="/treks/manaslu" element={<EverestTrekIndex />} />
        <Route path="/manaslu/:trekId" element={<TrekDetailPage />} />
        <Route path="/treks/mustang" element={<EverestTrekIndex />} />
        <Route path="/mustang/:trekId" element={<TrekDetailPage />} />
        <Route path="/" element={<CostAndDate />} />
        {/* <Route path="/booking" element={<BookingPage />} /> */}
        {/* <Route path="/customize-trip" element={<CustomizeTripPage />} /> */}
        <Route
          path="/everest-base-camp"
          element={<Itinerary days={everestBaseCamp.itinerary} />}
        />
        {/* <Route path="/trekdetailpage" element={<TrekDescription />} /> */}
        <Route path="/trekdetailpage" element={<CostAndDate />} />
        <Route path="/treks/:slug" element={<TrekDetailPage />} />

        {/* catch-all: any /tours/:slug →  */}
        <Route path="/treks/:region/:slug" element={<TrekDetailPage />} />
        <Route path="/everest/:trekId" element={<TrekDetailPage />} />
        <Route path="/about-us/*" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/customize-trip" element={<CustomizeTripPage />} />
        <Route path="/trip-booking" element={<BookingPage />} />
        <Route path="/trekoverview" element={<TrekOverview />} />

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
      </Route>
    </Routes>
  </Router>
);

export default App;
