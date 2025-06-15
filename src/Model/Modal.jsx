// src/components/ui/Modal.jsx
import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
