import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Teams from './pages/Teams';
import SetupProfile from './pages/SetupProfile';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/signup';
import OnboardingPage from './pages/onboarding';
import TaiwanMapPage from './pages/TaiwanMapPage';
import AuthProvider from './context/auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/taiwan-map" element={<TaiwanMapPage />} />

            {/* Protected Routes (require auth + profile) */}
            <Route
              path="/teams"
              element={
                <ProtectedRoute requireProfile={true}>
                  <Teams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requireProfile={true}>
                  <SetupProfile />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes (require auth, but may not have profile yet) */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute checkProfileExists={false}>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;