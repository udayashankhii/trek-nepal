import { fetchAllTreks } from "../api/service/trekService";
import { useLocation } from "react-router-dom";
import useSWR from "swr";

export default function DataPreloader() {
  const location = useLocation();
  const connection = navigator?.connection;
  const isSaveData = connection?.saveData === true;
  const isSlowConnection = ["slow-2g", "2g"].includes(connection?.effectiveType);
  const shouldPreload = location.pathname === "/" && !isSaveData && !isSlowConnection;

  const { isLoading } = useSWR(shouldPreload ? "/treks/" : null, fetchAllTreks, {
    revalidateOnMount: true,
  });

  if (!isLoading || !shouldPreload) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#f8fcfa] to-[#eef5f1] flex items-center justify-center">
      <div className="text-center px-6">
        <img
          src="/evertreknepallogo.webp"
          alt="EverTrek Nepal"
          className="w-36 sm:w-40 h-auto mx-auto mb-5"
          onError={(event) => {
            event.currentTarget.src = "/logo.webp";
          }}
        />

        <p className="text-[#0b2f4f] font-semibold tracking-wide text-sm sm:text-base mb-4">
          Preparing your Himalayan journey...
        </p>

        <div className="flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce"></div>
          <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.15s]"></div>
          <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.3s]"></div>
        </div>
      </div>
    </div>
  );
}
