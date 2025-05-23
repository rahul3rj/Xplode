import React from "react";
import Login from "./pages/Login";
import ErrorBoundary from "./components/ErrorBoundary";
import {Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="h-screen w-full bg-black">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
