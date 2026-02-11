import { BrowserRouter } from 'react-router-dom'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { AdminRoute, UserRoute } from './components/ProtectedRoute'
import './App.css'

// Components
import Nav from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import FeaturedPhotos from './components/FeaturedPhotos.jsx'
import Preview from './components/Preview.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'
import ContactForm from './components/ContactUs.jsx'

// Pages
import LoginPage from './Pages/Login.jsx'
import SignupPage from './Pages/Signup.jsx'
import WildlifeGallery from './Pages/Gallery.jsx'
import AboutUs from './Pages/AboutUs.jsx'
import ProfilePage from './Pages/ProfilePage.jsx'
import Wishlist from './Pages/Wishlist.jsx'
import Cart from './Pages/Cart.jsx'
import Blog from './Pages/Blog.jsx'
import Contact from './Pages/ContactPage.jsx'

// Admin Pages
import AdminLogin from './Pages/admin/AdminLogin.jsx'
import Dashboard from './Pages/admin/Dashboard.jsx'
import Users from './Pages/admin/Users.jsx'
import Products from './Pages/admin/Products.jsx'
import Purchases from './Pages/admin/Purchases.jsx'
import AddBlogPage from './Pages/admin/Addblog.jsx'
import Paymentstatuspage from './Pages/admin/Paymentstatuspage.jsx'
import AdminReview from './Pages/admin/AdminReview.jsx'

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const noFooterPages = [
    '/gallery', 
    '/wishlist', 
    '/profile',
    '/admin',
    '/admin/dashboard',
    '/admin/users',
    '/admin/products',
    '/admin/purchases',
    '/admin/Addblog',
    '/admin/payment-status',
    '/admin/reviews',
  ];
  const showFooter = !noFooterPages.includes(location.pathname);

  return (
    <>
      <Routes>
        {/* ============================================ */}
        {/* PUBLIC ROUTES */}
        {/* ============================================ */}
        
        <Route path="/" element={
          <>
            <Nav />
            <Home />
            <FeaturedPhotos />
            <Preview />
            <About />
            <ContactForm />
          </>
        } />
        
        <Route path="/login" element={
          <>
            <Nav />
            <LoginPage />
          </>
        } />
        
        <Route path="/signup" element={
          <>
            <Nav />
            <SignupPage />
          </>
        } />
        
        <Route path="/gallery" element={
          <>
            <WildlifeGallery />
            <Footer />
          </>
        } />
        
        <Route path="/blog" element={
          <>
            <Nav />
            <Blog />
          </>
        } />

        <Route path="/about-us" element={
          <>
            <Nav />
            <AboutUs />
          </>
        } />

        <Route path="/contact" element={
          <>
            <Nav />
            <Contact />
          </>
        } />

        {/* ============================================ */}
        {/* PROTECTED USER ROUTES */}
        {/* ============================================ */}
        
        <Route path="/profile" element={
          <UserRoute>
            <ProfilePage />
          </UserRoute>
        } />
        
        <Route path="/wishlist" element={
          <UserRoute>
            <Wishlist />
          </UserRoute>
        } />
        
        <Route path="/cart" element={
          <UserRoute>
            <Cart />
          </UserRoute>
        } />

        {/* ============================================ */}
        {/* ADMIN LOGIN - PUBLIC (anyone can see login page) */}
        {/* ============================================ */}
        
        <Route path="/admin" element={<AdminLogin />} />

        {/* ============================================ */}
        {/* PROTECTED ADMIN ROUTES - Require Admin Login */}
        {/* ============================================ */}
        
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        
        <Route path="/admin/users" element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        } />
        
        <Route path="/admin/products" element={
          <AdminRoute>
            <Products />
          </AdminRoute>
        } />
        
        <Route path="/admin/purchases" element={
          <AdminRoute>
            <Purchases />
          </AdminRoute>
        } />
        
        <Route path="/admin/Addblog" element={
          <AdminRoute>
            <AddBlogPage />
          </AdminRoute>
        } />
        
        <Route path="/admin/payment-status" element={
          <AdminRoute>
            <Paymentstatuspage />
          </AdminRoute>
        } />
        
        <Route path="/admin/reviews" element={
          <AdminRoute>
            <AdminReview />
          </AdminRoute>
        } />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {showFooter && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App