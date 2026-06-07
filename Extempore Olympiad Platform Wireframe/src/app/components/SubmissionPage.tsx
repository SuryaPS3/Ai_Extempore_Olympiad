import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { useExam, type RoundNumber } from "../context/ExamContext";

type UploadPhase = "uploading" | "success";

const ROUNDS: RoundNumber[] = [1, 2, 3];

function buildSubmissionFormData(
  recordings: Partial<Record<RoundNumber, Blob>>,
  grade: string
): FormData {
  const formData = new FormData();
  formData.append("grade", grade);

  ROUNDS.forEach((round) => {
    const blob = recordings[round];
    if (blob) {
      formData.append(`round_${round}_audio`, blob, `round${round}.webm`);
    }
  });

  formData.append("submitted_at", new Date().toISOString());
  formData.append("total_rounds", "3");

  return formData;
}

function mockUploadAPI(_formData: FormData): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
}

export function SubmissionPage() {
  const navigate = useNavigate();
  const { recordings, grade } = useExam();
  const [phase, setPhase] = useState<UploadPhase>("uploading");
  const [uploadProgress, setUploadProgress] = useState(0);
  const hasStartedUpload = useRef(false);

  useEffect(() => {
    if (hasStartedUpload.current) return;
    hasStartedUpload.current = true;

    const formData = buildSubmissionFormData(recordings, grade);
    let cancelled = false;

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + 5;
      });
    }, 150);

    mockUploadAPI(formData)
      .then(() => {
        if (cancelled) return;
        clearInterval(progressInterval);
        setUploadProgress(100);
        setPhase("success");
      })
      .catch(() => {
        if (cancelled) return;
        clearInterval(progressInterval);
      });

    return () => {
      cancelled = true;
      clearInterval(progressInterval);
    };
  }, [recordings, grade]);

  if (phase === "success") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-28 pb-8 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">

          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-[#22C55E]" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-2">
            Olympiad Complete!
          </h2>
          <p className="text-center text-[#475569] mb-6">
            Thank you for participating. Your exam has been submitted for AI
            review. You will be notified once your results are ready.
          </p>

          {/* Submission Summary */}
          <div className="space-y-3 mb-8">
            {ROUNDS.map((round) => (
              <div
                key={round}
                className="bg-white border-l-4 border-[#22C55E] rounded p-4 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-[#1E293B]">
                    Round {round} —{" "}
                    {round === 1
                      ? "Warm Up"
                      : round === 2
                        ? "Creative Round"
                        : "Challenge"}
                  </p>
                </div>
                <span className="text-sm text-[#22C55E]">Submitted</span>
              </div>
            ))}
          </div>

          {grade && (
            <p className="text-center text-sm text-[#475569] mb-6">
              Grade: <span className="font-medium text-[#1E293B]">{grade}</span>
            </p>
          )}

          <button
            onClick={() => navigate("/result-pending")}
            className="w-full h-12 bg-[#1B6B8A] text-white font-bold rounded-md hover:bg-[#155A72] transition-colors"
          >
            View Submission Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-28 pb-8 px-4">
      <div className="w-full max-w-[480px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">

        {/* Loader */}
        <div className="flex justify-center mb-4">
          <Loader2 className="w-12 h-12 text-[#475569] animate-spin" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-center text-[#1E293B] mb-2">
          Round 3 Complete
        </h2>
        <p className="text-center text-[#475569] mb-6">
          Uploading your 3 responses securely to the server... Please do not
          close this tab.
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B6B8A] rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>

        {/* Submission Checklist */}
        <div className="space-y-3 mb-8">
          {ROUNDS.map((round) => (
            <div
              key={round}
              className="bg-white border-l-4 border-[#F59E0B] rounded p-4 flex items-center gap-3"
            >
              <Clock className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-[#1E293B]">
                  Round {round} —{" "}
                  {round === 1
                    ? "Warm Up"
                    : round === 2
                      ? "Creative Round"
                      : "Challenge"}
                </p>
              </div>
              <span className="text-sm text-[#F59E0B]">Uploading...</span>
            </div>
          ))}
        </div>

        {/* Warning Text */}
        <p className="text-center text-sm text-[#475569]">
          Do not close this tab until submission is complete
        </p>
      </div>
    </div>
  );
}
