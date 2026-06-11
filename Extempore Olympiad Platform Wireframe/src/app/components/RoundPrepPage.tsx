import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Clock } from "lucide-react";
import { useExam } from "../context/ExamContext";

export function RoundPrepPage() {
  const navigate = useNavigate();
  const { currentRound, getRoundConfig } = useExam();
  const roundConfig = getRoundConfig();
  const [secondsLeft, setSecondsLeft] = useState(roundConfig.prepSeconds);

  useEffect(() => {
    setSecondsLeft(roundConfig.prepSeconds);
  }, [currentRound, roundConfig.prepSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate("/recording");
      return;
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((previous) => previous - 1);
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [secondsLeft, navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-28 pb-8 px-4">
      <div className="w-full max-w-[520px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">

        {/* Header Badges */}
        <div className="flex justify-between items-center mb-2">
          <span className="bg-[#1B6B8A] text-white px-3 py-1 rounded-full text-sm font-medium">
            Round {currentRound} of 3
          </span>
          <span className="bg-[#F97316] text-white px-3 py-1 rounded-full text-sm font-medium">
            {roundConfig.marks} Marks
          </span>
        </div>

        <p className="text-[#475569] text-sm mb-6">{roundConfig.subtitle}</p>

        {/* Timer Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-8 h-8 text-[#1E293B]" />
            <span className="text-4xl font-bold text-[#1E293B]">
              {Math.floor(Math.max(secondsLeft, 0) / 60)}:
              {(Math.max(secondsLeft, 0) % 60).toString().padStart(2, "0")}
            </span>
            <span className="text-xl text-[#475569]">(prep)</span>
          </div>
          <p className="text-[#475569] text-sm">
            {secondsLeft > 0
              ? "Take your time to prepare"
              : "Preparation complete. Moving to the recording screen..."}
          </p>
        </div>

        {/* Topic Card */}
        <div className="bg-[#E0F2FE] rounded-md p-5 mb-6">
          <p className="text-[#1B6B8A] text-xs uppercase tracking-wider mb-2">
            Round {currentRound} — Topic
          </p>
          <p className="text-[#1E293B] text-lg font-medium text-center">
            {roundConfig.topic}
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/recording")}
          className="w-full h-11 bg-[#374151] text-white font-medium rounded-md hover:bg-[#1F2937] transition-colors"
        >
          I am Ready (skip prep)
        </button>
        <p className="text-center text-sm text-[#475569] mt-2">
          or wait for prep time to complete
        </p>
      </div>
    </div>
  );
}
