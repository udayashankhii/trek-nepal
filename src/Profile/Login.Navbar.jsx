import { useState } from "react";
import LoginForm from "./Login/LoginForm";
import { X } from "lucide-react";

// LoginNavbar.jsx
const LoginNavbar = ({ className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className={`
          inline-flex items-center rounded-full bg-[#f1f1f1] px-0.5 py-0.5
          shadow-sm border border-black/5 ${className}
        `}
        style={{ minHeight: "35px" }}
      >
        <button
          onClick={openModal}
          className="px-2.5 py-1.5 text-sm font-medium rounded-full 
                     text-gray-700 hover:bg-white hover:shadow-sm transition"
        >
          Log in
        </button>

        <button
          onClick={openModal} // optional: open same modal with register tab later
          className="px-2.5 py-1.5 text-sm font-medium rounded-full 
                     text-gray-700 hover:bg-white hover:shadow-sm transition"
        >
          Register
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center 
                     bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md 
                       mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                         transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <LoginForm onClose={closeModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginNavbar;