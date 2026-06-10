import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RoleRoute } from './components/RouteGuards';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import AllPrompts from './pages/AllPrompts';
import PromptDetails from './pages/PromptDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import PremiumPayment from './pages/PremiumPayment';
import NotFound from './pages/NotFound';

// Dashboard layout & pages
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Profile from './pages/dashboard/Profile';
import SavedPrompts from './pages/dashboard/SavedPrompts';
import MyReviews from './pages/dashboard/MyReviews';
import MyPrompts from './pages/dashboard/MyPrompts';

// Creator dashboard pages
import CreatorAnalytics from './pages/dashboard/CreatorAnalytics';
import AddPrompt from './pages/dashboard/AddPrompt';

// Admin dashboard pages
import AdminAnalytics from './pages/dashboard/AdminAnalytics';
import AdminUsers from './pages/dashboard/AdminUsers';
import AdminPrompts from './pages/dashboard/AdminPrompts';
import AdminPayments from './pages/dashboard/AdminPayments';
import AdminReports from './pages/dashboard/AdminReports';

// Layout wrapping navbar and footer for public/standard pages
const PublicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Page Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="prompts" element={<AllPrompts />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Private Details and checkout payment pages */}
            <Route path="prompts/:id" element={
              <PrivateRoute>
                <PromptDetails />
              </PrivateRoute>
            } />
            <Route path="payment" element={
              <PrivateRoute>
                <PremiumPayment />
              </PrivateRoute>
            } />
            
            {/* 404 Route */}
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* User/Creator/Admin Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            {/* Default redirect to profile page */}
            <Route index element={<Navigate to="/dashboard/profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-prompts" element={<MyPrompts />} />
            <Route path="saved-prompts" element={<SavedPrompts />} />
            <Route path="my-reviews" element={<MyReviews />} />

            {/* Creator specific routes */}
            <Route path="creator-analytics" element={
              <RoleRoute allowedRoles={['creator', 'admin']}>
                <CreatorAnalytics />
              </RoleRoute>
            } />
            <Route path="add-prompt" element={
              <RoleRoute allowedRoles={['creator', 'admin']}>
                <AddPrompt />
              </RoleRoute>
            } />

            {/* Admin specific routes */}
            <Route path="admin-analytics" element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminAnalytics />
              </RoleRoute>
            } />
            <Route path="admin-users" element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminUsers />
              </Route>
            } />
            <Route path="admin-prompts" element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminPrompts />
              </RoleRoute>
            } />
            <Route path="admin-payments" element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminPayments />
              </RoleRoute>
            } />
            <Route path="admin-reports" element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminReports />
              </RoleRoute>
            } />
          </Route>
        </Routes>
      </Router>
      
      {/* React Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthProvider>
  );
}

export default App;
