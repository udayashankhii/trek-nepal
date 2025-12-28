import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function TrekErrorPage({ error }) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <AlertCircle className="h-16 w-16 text-red-400 mb-3" aria-hidden="true" />
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Trek Details Unavailable
      </h1>
      <p className="text-gray-600 mb-4">
        {error || "Failed to fetch trek details."}
      </p>
      <button
        onClick={() => navigate("/treks")}
        className="bg-blue-600 text-white px-5 py-2 rounded font-medium hover:bg-blue-700 transition"
      >
        Back to Treks
      </button>
    </main>
  );
}
