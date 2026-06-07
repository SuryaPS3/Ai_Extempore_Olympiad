import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Clock, Mic } from "lucide-react";
import { useExam } from "../context/ExamContext";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RecordingPage() {
  const navigate = useNavigate();
  const { currentRound, saveRecording, getRoundConfig, isLastRound } =
    useExam();
  const roundConfig = getRoundConfig();

  const [secondsLeft, setSecondsLeft] = useState(roundConfig.speakSeconds);
  const [isStopping, setIsStopping] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const hasStoppedRef = useRef(false);

  const waveformHeights = useMemo(
    () => [...Array(32)].map(() => Math.random() * 100),
    []
  );

  const stopRecording = useCallback(() => {
    if (hasStoppedRef.current) return;
    hasStoppedRef.current = true;
    setIsStopping(true);

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      navigate(isLastRound ? "/submission" : "/rest");
    }
  }, [isLastRound, navigate]);

  useEffect(() => {
    setSecondsLeft(roundConfig.speakSeconds);
    hasStoppedRef.current = false;
    setIsStopping(false);
  }, [currentRound, roundConfig.speakSeconds]);

  useEffect(() => {
    let cancelled = false;

    async function initMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        chunksRef.current = [];

        const mimeType = MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus"
        )
          ? "audio/webm;codecs=opus"
          : "audio/webm";

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          saveRecording(currentRound, blob);
          streamRef.current?.getTracks().forEach((track) => track.stop());
          navigate(isLastRound ? "/submission" : "/rest");
        };

        recorder.start(1000);
      } catch (error) {
        console.error("Microphone access failed:", error);
        alert(
          "Microphone access is required to record your speech. Please allow microphone access and reload the page."
        );
      }
    }

    initMic();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [currentRound, saveRecording, navigate, isLastRound]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      stopRecording();
      return;
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [secondsLeft, stopRecording]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-28 pb-8 px-4">
      <div className="w-full max-w-[520px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">

        {/* Header Badges */}
        <div className="flex justify-between items-center mb-6">
          <span className="bg-[#1B6B8A] text-white px-3 py-1 rounded-full text-sm font-medium">
            Round {currentRound} of 3
          </span>
          <span className="bg-[#FEE2E2] text-[#BE123C] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-[#DC2626] rounded-full animate-pulse"></span>
            Recording
          </span>
        </div>

        {/* Timer Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#DC2626]" />
            <span className="text-2xl font-bold text-[#DC2626]">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-lg text-[#DC2626]">(Recording)</span>
          </div>
          <Mic className="w-6 h-6 text-[#1B6B8A]" />
        </div>

        {/* Waveform */}
        <div className="bg-[#F1F5F9] rounded p-4 mb-6 h-12 flex items-end justify-around gap-1">
          {waveformHeights.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-[#1B6B8A] rounded-full animate-pulse"
              style={{
                height: `${height}%`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        {/* Topic Reminder */}
        <div className="bg-[#E0F2FE] rounded-md p-5 mb-6">
          <p className="text-[#1B6B8A] text-xs uppercase tracking-wider mb-2">
            Round {currentRound} — Topic
          </p>
          <p className="text-[#1E293B] text-lg font-medium text-center">
            {roundConfig.topic}
          </p>
        </div>

        {/* Finish Button */}
        <button
          onClick={stopRecording}
          disabled={isStopping}
          className="w-full h-12 bg-[#1B6B8A] text-white font-bold rounded-md hover:bg-[#155A72] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Finish Round {currentRound}
        </button>
      </div>
    </div>
  );
}
