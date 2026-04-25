import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login from './screen/login'; // ✅ IMPORTANT (uncommented)
import Dashboard from './components/Dashboard';
import Register from './screen/registerpage';
import AdminDashboard from './screen/adminDashboard';
import ProductsPage from './screen/products';
import CartPage from "./screen/cart";
import CheckoutPage from "./screen/checkout";
import PaymentPage from "./screen/payment";
import OrdersPage from "./screen/orders";
import AboutPage from "./screen/about";
import PrivacyPolicyPage from "./screen/privacy";
import TermsPage from "./screen/terms";
import ContactPage from "./screen/contact";
import TestimonialsPage from "./screen/testimonials";
import './App.css';

// 🔒 Protected Route
function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // ❌ Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin → go to dashboard
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth(); // ✅ Needed for login redirect

  return (
    <Routes>
      {/* 🌍 Public routes */}

      {/* ✅ Login route FIXED */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />

      <Route path="/register" element={<Register />} />

      {/* 🏠 Dashboard (PUBLIC) */}
      <Route path="/" element={<Dashboard />} />

      {/* 🔒 Protected routes */}
      <Route path="/products" element={
        <ProtectedRoute>
          <ProductsPage />
        </ProtectedRoute>
      } />

      <Route path="/cart" element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      } />

      <Route path="/checkout" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />

      <Route path="/payment" element={
        <ProtectedRoute>
          <PaymentPage />
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      } />

      <Route path="/about" element={
        <ProtectedRoute>
          <AboutPage />
        </ProtectedRoute>
      } />

      <Route path="/privacy" element={
        <ProtectedRoute>
          <PrivacyPolicyPage />
        </ProtectedRoute>
      } />

      <Route path="/terms" element={
        <ProtectedRoute>
          <TermsPage />
        </ProtectedRoute>
      } />

      <Route path="/contact" element={
        <ProtectedRoute>
          <ContactPage />
        </ProtectedRoute>
      } />

      <Route path="/testimonials" element={
        <ProtectedRoute>
          <TestimonialsPage />
        </ProtectedRoute>
      } />

      {/* 👑 Admin route */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* 🔁 Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const basename = process.env.PUBLIC_URL || "/test_giftshop";

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;