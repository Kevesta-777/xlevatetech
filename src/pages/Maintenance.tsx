import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Maintenance = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn(
      "Sorry! This page is maintained now..",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4"> 🚧 Blog Under Maintenance </h1>
        <p className="text-xl text-gray-600 mb-4">We’re currently making updates to our blog. Please check back soon.
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default Maintenance;
