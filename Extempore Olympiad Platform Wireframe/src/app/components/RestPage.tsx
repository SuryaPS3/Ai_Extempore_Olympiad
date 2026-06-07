import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Clock } from "lucide-react";
import { ROUND_CONFIG, useExam, type RoundNumber } from "../context/ExamContext";

export function RestPage() {
  const navigate = useNavigate();
  const {
    currentRound,
    recordings,
    advanceToNextRound,
    isLastRound,
  } = useExam();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [canStartEarly, setCanStartEarly] = useState(false);

  const recording = recordings[currentRound as RoundNumber];
  const recordingUrl = useMemo(
    () => (recording ? URL.createObjectURL(recording) : null),
    [recording]
  );

  useEffect(() => {
    return () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    };
  }, [recordingUrl]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    const timer = setTimeout(() => {
      setCanStartEarly(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [currentRound]);

  const nextRound = !isLastRound
    ? ROUND_CONFIG[(currentRound + 1) as RoundNumber]
    : null;

  const handleContinue = () => {
    if (isLastRound) {
      navigate("/submission");
      return;
    }
    advanceToNextRound();
    navigate("/round-prep");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-28 pb-8 px-4">
      <div className="w-full max-w-[480px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-[#22C55E]" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-2">
          Round {currentRound} Complete!
        </h2>
        <p className="text-center text-[#475569] mb-6">
          Uploading your recording...
        </p>

        {recording && (
          <div className="mb-6 rounded-md border border-[#CBD5E1] p-4">
            <p className="text-sm text-[#475569] mb-2">
              Recording saved ({Math.round(recording.size / 1024)} KB)
            </p>
            {recordingUrl && (
              <audio controls src={recordingUrl} className="w-full" />
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B6B8A] rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-[#475569] mb-6">Uploading... please wait</p>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6" />

        {/* Break Timer */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-[#475569]" />
            <span className="text-3xl font-bold text-[#475569]">2:00</span>
          </div>
          <p className="text-sm text-[#475569]">
            {isLastRound
              ? "Proceed to final submission"
              : `Round ${currentRound + 1} begins automatically`}
          </p>
        </div>

        {/* Next Round Preview */}
        {nextRound && (
          <div className="bg-[#F1F5F9] rounded-lg p-4 mb-6">
            <p className="text-[#1B6B8A] font-semibold mb-1">
              Coming Up: Round {nextRound.round} — {nextRound.name} Round
            </p>
            <p className="text-sm text-[#475569]">
              {nextRound.marks} Marks · {nextRound.prepSeconds}s Prep ·{" "}
              {nextRound.speakSeconds}s Speak
            </p>
          </div>
        )}

        {/* Early Start Button */}
        <button
          onClick={handleContinue}
          disabled={!canStartEarly}
          className="w-full h-11 border-2 border-[#1B6B8A] text-[#1B6B8A] font-medium rounded-md hover:bg-[#E0F2FE] disabled:border-[#CBD5E1] disabled:text-[#94A3B8] disabled:cursor-not-allowed transition-colors"
        >
          {isLastRound
            ? "Continue to Submission"
            : `Start Round ${currentRound + 1} Early`}
        </button>
      </div>
    </div>
  );
}
