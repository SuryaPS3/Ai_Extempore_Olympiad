import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { useExam, type RoundNumber } from "../context/ExamContext";

type UploadPhase = "uploading" | "success";

const ROUNDS: RoundNumber[] = [1, 2, 3];
const SUBMIT_URL = "http://localhost:8000/api/submit-exam/";

async function handleUpload(
  recordings: Partial<Record<RoundNumber, Blob>>,
  grade: string,
  onProgress: (percent: number) => void
): Promise<void> {
  const roundsWithAudio = ROUNDS.filter((round) => recordings[round]);

  if (roundsWithAudio.length === 0) {
    throw new Error("No recordings available to upload");
  }

  for (let i = 0; i < roundsWithAudio.length; i++) {
    const round = roundsWithAudio[i];
    const blob = recordings[round]!;

    const formData = new FormData();
    formData.append("grade_level", grade);
    formData.append("round_number", String(round));
    formData.append("audio_file", blob, `round${round}.webm`);

    const response = await fetch(SUBMIT_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        `Round ${round} failed (${response.status}): ${detail || response.statusText}`
      );
    }

    onProgress(Math.round(((i + 1) / roundsWithAudio.length) * 100));
  }
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

    let cancelled = false;

    (async () => {
      try {
        await handleUpload(recordings, grade, (percent) => {
          if (!cancelled) setUploadProgress(percent);
        });
        if (!cancelled) setPhase("success");
      } catch (error) {
        console.error("Upload failed:", error);
        if (!cancelled) {
          alert(
            "Failed to upload your responses. Please ensure the server is running at http://localhost:8000 and try again."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [recordings, grade]);

  if (phase === "success") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-28 pb-8 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-[#22C55E]" />
          </div>
          <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-2">
            Olympiad Complete!
          </h2>
          <p className="text-center text-[#475569] mb-6">
            Thank you for participating. Your exam has been submitted for AI
            review. You will be notified once your results are ready.
          </p>
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
        <div className="flex justify-center mb-4">
          <Loader2 className="w-12 h-12 text-[#475569] animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-center text-[#1E293B] mb-2">
          Round 3 Complete
        </h2>
        <p className="text-center text-[#475569] mb-6">
          Uploading your 3 responses securely to the server... Please do not
          close this tab.
        </p>
        <div className="mb-8">
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B6B8A] rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
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
        <p className="text-center text-sm text-[#475569]">
          Do not close this tab until submission is complete
        </p>
      </div>
    </div>
  );
}
