// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import TrekCard from "./treks/TrekCard";
import Home from "./home/Home";
import TourCard from "./tours/TourCard";
import TourIndexPage from "./tours/TourPage";
import Navbar from "./home/Navbar";
import Footer from "./home/Footer";

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
    <Routes>
      {/* All routes under “/” will render inside Layout */}
      <Route path="/" element={<Layout />}>
        {/* index → renders at “/” */}
        <Route index element={<Home />} />
        <Route path="trekcard" element={<TrekCard />} />
        <Route path="tourcard" element={<TourCard />} />
        <Route path="tourindex" element={<TourIndexPage />} />
        {/* add more here */}
      </Route>
    </Routes>
  </Router>
);

export default App;
