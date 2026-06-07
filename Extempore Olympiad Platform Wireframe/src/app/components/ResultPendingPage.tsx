import { useNavigate } from "react-router";
import { Clock } from "lucide-react";

export function ResultPendingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-28 pb-8 px-4">
      <div className="w-full max-w-[520px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* Banner */}
        <div className="bg-[#1B6B8A] text-white px-6 py-3 text-center font-semibold">
          Your submission is under review
        </div>

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <Clock className="w-14 h-14 text-[#1B6B8A]" />
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-center text-[#1E293B] mb-2">
            Result Pending Approval
          </h2>
          <p className="text-center text-[#475569] mb-8 max-w-md mx-auto">
            Your teacher will review and approve your result. You'll be notified once it's available.
          </p>

          {/* Session Summary Box */}
          <div className="bg-[#F8FAFC] rounded-lg p-5 mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-[#475569]">Date:</span>
              <span className="text-[#1E293B] font-medium">June 10, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Grade:</span>
              <span className="text-[#1E293B] font-medium">Class 6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Rounds completed:</span>
              <span className="text-[#1E293B] font-medium">3/3 ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Status:</span>
              <span className="text-[#F59E0B] font-medium">Awaiting teacher approval</span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full h-11 border-2 border-[#1B6B8A] text-[#1B6B8A] font-medium rounded-md hover:bg-[#E0F2FE] transition-colors mb-3"
          >
            Return to Dashboard
          </button>

          <p className="text-center text-sm text-[#475569]">
            Results usually available within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
