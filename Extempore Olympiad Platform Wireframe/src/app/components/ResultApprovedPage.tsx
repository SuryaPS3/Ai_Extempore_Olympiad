import { Download, BarChart3 } from "lucide-react";

export function ResultApprovedPage() {
  const rounds = [
    { round: "Round 1", max: 20, score: 16, feedback: "Good topic relevance..." },
    { round: "Round 2", max: 30, score: 24, feedback: "Creative story!..." },
    { round: "Round 3", max: 50, score: 38, feedback: "All mystery words used!" }
  ];

  const criteria = [
    { name: "C1 Content", score: 16, max: 20 },
    { name: "C2 Structure", score: 14, max: 20 },
    { name: "C3 Language", score: 16, max: 20 },
    { name: "C4 Delivery", score: 18, max: 20 },
    { name: "C5 Originality", score: 14, max: 20 }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-28 pb-8 px-4">
      <div className="w-full max-w-[560px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* Score Banner */}
        <div className="bg-gradient-to-r from-[#1B6B8A] to-[#0E4F66] text-white px-6 py-6 text-center">
          <p className="text-sm mb-1">Your Score</p>
          <p className="text-5xl font-bold mb-2">78 / 100</p>
          <p className="text-lg mb-1">🥈 Silver Certificate</p>
          <p className="text-sm opacity-90">Global Rank: #342 of 4,891 in Class 6</p>
        </div>

        <div className="p-6">
          {/* Round Breakdown Table */}
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1B6B8A] text-white text-sm">
                  <th className="text-left px-4 py-3 font-semibold">Round</th>
                  <th className="text-center px-4 py-3 font-semibold">Max</th>
                  <th className="text-center px-4 py-3 font-semibold">Your Score</th>
                  <th className="text-left px-4 py-3 font-semibold">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((round, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                    <td className="px-4 py-3 text-sm font-medium text-[#1E293B]">{round.round}</td>
                    <td className="px-4 py-3 text-sm text-center text-[#475569]">{round.max}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-[#1B6B8A]">{round.score}</td>
                    <td className="px-4 py-3 text-sm text-[#475569]">{round.feedback}</td>
                  </tr>
                ))}
                <tr className="bg-[#E0F2FE] font-bold">
                  <td className="px-4 py-3 text-sm text-[#1E293B]">Total</td>
                  <td className="px-4 py-3 text-sm text-center text-[#1E293B]">100</td>
                  <td className="px-4 py-3 text-sm text-center text-[#1B6B8A]">78</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Criteria Bars */}
          <div className="mb-6 space-y-3">
            {criteria.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[#1E293B]">{item.name}</span>
                  <span className="text-sm text-[#475569]">{item.score}/{item.max}</span>
                </div>
                <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1B6B8A] rounded-full"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-4">
            <button className="flex-1 h-11 bg-[#1B6B8A] text-white font-medium rounded-md hover:bg-[#155A72] transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Certificate
            </button>
            <button className="flex-1 h-11 border-2 border-[#1B6B8A] text-[#1B6B8A] font-medium rounded-md hover:bg-[#E0F2FE] transition-colors flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              View Detailed Feedback
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[#475569]">
            Reviewed and approved by: Ms. Sarah Johnson on June 11, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
