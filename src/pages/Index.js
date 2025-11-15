import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

//layouts
import Header, { Mainheader } from "./../layouts/Header";
import Footer from "./../layouts/Footer";
import Footer2 from "../layouts/Footer2";
import ScrollToTop from "./../layouts/ScrollToTop";

//Pages
import Home from "./Home";
import AboutUs from "./AboutUs";
import Team from "./Team";
import Pricing from "./Pricing";
import Faq from "./Faq";
import Schedule from "./Schedule";
import ErrorPage from "./ErrorPage";
import UnderConstruction from "./UnderConstruction";
import ComingSoon from "./ComingSoon";
import Portfolio from "./Portfolio";
import PortfolioDetails from "./PortfolioDetails";
import Services from "./Services";
import ServicesFortyPlusFit from "./ServicesFortyPlusFit";
import ServicesDetails from "./ServicesDetails";
import BlogGrid from "./BlogGrid";
import BlogLargeSidebar from "./BlogLargeSidebar";
import BlogListSidebar from "./BlogListSidebar";
import BlogDetail from "./BlogDetail";
import Appointment from "./Appointment";
import WeightCalculator from "./WeightCalculator";
import ContactUs from "./ContactUs";
import Home2 from "./Home2";
import Header2 from "../layouts/Header2";
import Home3 from "./Home3";
import Home4 from './Home';

import Programs  	from './Programs'  ;
import Subscriptions from './Subscriptions';
import Subscription  from './Subscription';
/* Protected */
import Dashboard 	from './Dashboard' ;
import Invoices  	from './Invoices'  ;
import Profile  	from './Profile'    ;
import Onboarding 	from "./Onboarding";
/* Auth */
import Login  		from './Login'  ;
import Signup 		from './Signup';
import AuthCallback from './AuthCallback';
import ProtectedRoute 	from '../auth/ProtectedRoute'; 		// adjust relative path
import RedirectIfAuthed from '../routes/RedirectIfAuthed'; 	// adjust relative path


// src/pages/Index.js (or wherever your routes live)
import UserProfilePage from "./UserProfilePage";


function Index() {
  var baseName = "/";
  const scrollTopBtn = useRef(null);

  window.onscroll = () => {
    window.scrollY > 650
      ? scrollTopBtn.current.setAttribute("style", "display:block")
      : scrollTopBtn.current.setAttribute("style", "display:none");
  };
  return (
    <BrowserRouter basename={baseName}>
      <Routes>
	  
		{/* Public */}
		{/*<Route path="/login"  element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
		<Route path="/signup" element={<RedirectIfAuthed><Signup /></RedirectIfAuthed>} /> */}
	    <Route path="/auth/callback" element={<AuthCallback />} />
		<Route path="/login"  element={<RedirectIfAuthed to="/home-2"> <Login /> </RedirectIfAuthed>}/>
		<Route path="/signup" element={<RedirectIfAuthed to="/home-2"> <Signup /> </RedirectIfAuthed>} />
	    <Route path="/subscriptions" element={<Subscriptions />} />
		
		
		{/* Protect - Should be available after logon. */}
	    <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
		<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
		<Route path="/programs" element={<ProtectedRoute><Programs /></ProtectedRoute>} />
		<Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
		<Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
		<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

		{/* Wired to the Database. */}
		<Route path="/profilee" element={<UserProfilePage />} />

        {/* Private */}		
		{/*
        <Route element={<ProtectedRoute />}>
          {/*  
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        {/* 404, etc… 
        <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
		*/}
	  
		<Route path="/onboarding" element={<Onboarding />} />
        <Route path="/error-404" exact element={<ErrorPage />} />
        <Route path="/under-maintenance" exact element={<UnderConstruction />}/>
        <Route path="/appointment" exact element={<Appointment />} />
        <Route path="/coming-soon" exact element={<ComingSoon />} />
		
        <Route element={<MainLayout />}>
          <Route path="/allservices" exact element={<ServicesFortyPlusFit />} />
          <Route path="/" exact element={<Home />} />
          <Route path="/about-us" exact element={<AboutUs />} />
          <Route path="/team" exact element={<Team />} />
          <Route path="/faq" exact element={<Faq />} />
          <Route path="/pricing" exact element={<Pricing />} />
          <Route path="/schedule" exact element={<Schedule />} />
          <Route path="/portfolio" exact element={<Portfolio />} />
          <Route
            path="/portfolio-details"
            exact
            element={<PortfolioDetails />}
          />
          <Route path="/services" exact element={<Services />} />
          <Route path="/services-details" exact element={<ServicesDetails />} />
          <Route path="/blog-grid" exact element={<BlogGrid />} />
          <Route
            path="/blog-large-sidebar"
            exact
            element={<BlogLargeSidebar />}
          />
          <Route
            path="/blog-list-sidebar"
            exact
            element={<BlogListSidebar />}
          />
          <Route path="/blog-details" exact element={<BlogDetail />} />
          <Route
            path="/weight-calculator"
            exact
            element={<WeightCalculator />}
          />
          <Route path="/contact-us" exact element={<ContactUs />} />
        </Route>
		
        <Route element={<MainLayout2 />}>
          <Route path="/home-2" exact element={<Home2 />} />
        </Route>
        <Route element={<MainLayout3 />}>
          <Route path="/home-3" exact element={<Home3 />} />
        </Route>
      </Routes>
      {/* <Switcher /> */}
      <ScrollToTop />
      <button
        onClick={() => {
          window.scrollTo(0, 0);
        }}
        ref={scrollTopBtn}
        className="scroltop icon-up"
        type="button"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </BrowserRouter>
  );
}

function MainLayout() {
  return (
    <div className="page-wraper">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
function MainLayout2() {
  return (
    <div className="page-wraper">
      <Header2 />
      <Outlet />
      <Footer2 />
    </div>
  );
}
function MainLayout3() {
  const [headerFix, setheaderFix] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setheaderFix(window.scrollY > 50);
    });
  }, []);
  return (
    <div className="page-wraper">
      <header className="site-header mo-left header header-transparent style-1">
        <div
          className={`sticky-header mt-3 main-bar-wraper navbar-expand-lg ${
            headerFix ? "is-fixed" : ""
          }`}
        >
          <Mainheader />
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default Index;