import { fetchAllTreks } from "../api/service/trekService";
import useSWR from "swr";

export default function DataPreloader() {
  const { isLoading } = useSWR("/treks/", fetchAllTreks, {
    revalidateOnMount: true,
  });

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Replace with your actual logo */}
        <img 
          src="/log.png" 
          alt="EverTrek Nepal" 
          className="w-24 h-24 mx-auto"
        />
        
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
}
