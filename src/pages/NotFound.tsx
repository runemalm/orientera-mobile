
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MobileLayout from "../components/layout/MobileLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Fel: Användaren försökte nå en rutt som inte existerar:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MobileLayout title="Sidan hittades inte" showBackButton>
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-4">Sidan hittades inte</p>
        <a href="/" className="text-primary hover:underline">
          Tillbaka till startsidan
        </a>
      </div>
    </MobileLayout>
  );
};

export default NotFound;
