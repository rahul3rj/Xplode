import React from "react";
import Login from "./pages/Login";
import ErrorBoundary from "./components/ErrorBoundary";
import {Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";
import Details from "./pages/Details";
import SearchPage from "./pages/SearchPage"; // Add this import

const App = () => {
  return (
    <div className="h-screen w-full bg-black">
      <ErrorBoundary>
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/game/:appid" element={<ProtectedRoute><Details /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} /> {/* Add this line */}
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
