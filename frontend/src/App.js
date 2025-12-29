import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./LoginPage";
import FormPage from "./FormPage";
import AdminDashboard from "./AdminDashboard";
import ResetPassword from "./ResetPassword";

// Protected Route Component
const ProtectedRoute = ({ children, roleRequired = null }) => {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  
  // Check if user is authenticated
  if (!userEmail || !userRole) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role if required
  if (roleRequired && userRole !== roleRequired) {
    // Redirect to appropriate page based on user's actual role
    return userRole === "admin" 
      ? <Navigate to="/admin" replace />
      : <Navigate to="/form" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route 
        path="/form" 
        element={
          <ProtectedRoute>
            <FormPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute roleRequired="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Root route - redirect based on auth status */}
      <Route 
        path="/" 
        element={
          localStorage.getItem("userEmail") 
            ? (localStorage.getItem("userRole") === "admin" 
                ? <Navigate to="/admin" replace />
                : <Navigate to="/form" replace />)
            : <Navigate to="/login" replace />
        } 
      />
      
      {/* Catch all other routes */}
      <Route 
        path="*" 
        element={
          <Navigate to="/" replace />
        } 
      />
    </Routes>
  );
}

export default App;