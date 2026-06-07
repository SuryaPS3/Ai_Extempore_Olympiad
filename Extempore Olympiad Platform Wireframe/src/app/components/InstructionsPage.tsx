import { useState } from "react";
import { useNavigate } from "react-router";
import { useExam } from "../context/ExamContext";

export function InstructionsPage() {
  const [selectedGrade, setSelectedGrade] = useState("");
  const navigate = useNavigate();
  const { setGrade } = useExam();

  const grades = [
    "Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4",
    "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"
  ];

  const handleStart = () => {
    if (selectedGrade) {
      setGrade(selectedGrade);
      navigate("/round-prep");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-28 pb-8 px-4">
      <div className="w-full max-w-[480px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="bg-[#1B6B8A] text-white px-6 py-4 rounded-t-lg">
          <h1 className="text-xl font-semibold">Olympiad Instructions</h1>
        </div>

        <div className="p-6 space-y-4">
          <ul className="space-y-3 text-[#1E293B]">
            <li className="flex gap-3">
              <span className="text-[#1B6B8A]">•</span>
              <span>3 Rounds Total</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#1B6B8A]">•</span>
              <span>Round 1: 30s Prep / 60s Speak / 20 Marks</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#1B6B8A]">•</span>
              <span>Round 2: 45s Prep / 60s Speak / 30 Marks</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#1B6B8A]">•</span>
              <span>Round 3: 60s Prep / 60s Speak / 50 Marks</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#1B6B8A]">•</span>
              <span>Timer runs in background — focus on speaking!</span>
            </li>
          </ul>

          <div className="pt-4">
            <label className="block text-xs uppercase tracking-wide text-[#475569] mb-2">
              Select Your Grade
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full h-11 border border-[#CBD5E1] rounded px-3 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1B6B8A] focus:border-transparent"
            >
              <option value="">Choose your grade...</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStart}
            disabled={!selectedGrade}
            className="w-full h-12 bg-[#1B6B8A] text-white font-semibold rounded-md hover:bg-[#155A72] disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] disabled:cursor-not-allowed transition-colors mt-6"
          >
            Start Olympiad
          </button>
        </div>
      </div>
    </div>
  );
}
