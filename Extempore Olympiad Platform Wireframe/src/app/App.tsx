import { BrowserRouter, Routes, Route, Link } from "react-router";
import { ExamProvider } from "./context/ExamContext";
import { Navigation } from "./components/Navigation";
import { InstructionsPage } from "./components/InstructionsPage";
import { RoundPrepPage } from "./components/RoundPrepPage";
import { RecordingPage } from "./components/RecordingPage";
import { RestPage } from "./components/RestPage";
import { SubmissionPage } from "./components/SubmissionPage";
import { ResultPendingPage } from "./components/ResultPendingPage";
import { ResultApprovedPage } from "./components/ResultApprovedPage";
import { AdminDashboard } from "./components/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <ExamProvider>
      <Navigation />
      <Routes>
        <Route path="/" element={<InstructionsPage />} />
        <Route path="/round-prep" element={<RoundPrepPage />} />
        <Route path="/recording" element={<RecordingPage />} />
        <Route path="/rest" element={<RestPage />} />
        <Route path="/submission" element={<SubmissionPage />} />
        <Route path="/result-pending" element={<ResultPendingPage />} />
        <Route path="/result-approved" element={<ResultApprovedPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      {/* Quick Navigation Panel (For Demo) */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs border border-gray-200">
        <p className="font-semibold text-sm text-[#1B6B8A] mb-2">Navigate Screens:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Link to="/" className="text-[#1B6B8A] hover:underline">1. Instructions</Link>
          <Link to="/round-prep" className="text-[#1B6B8A] hover:underline">2. Round Prep</Link>
          <Link to="/recording" className="text-[#1B6B8A] hover:underline">3. Recording</Link>
          <Link to="/rest" className="text-[#1B6B8A] hover:underline">4. Rest Screen</Link>
          <Link to="/submission" className="text-[#1B6B8A] hover:underline">5. Submission</Link>
          <Link to="/result-pending" className="text-[#1B6B8A] hover:underline">6. Result Pending</Link>
          <Link to="/result-approved" className="text-[#1B6B8A] hover:underline">7. Result Approved</Link>
          <Link to="/admin" className="text-[#1B6B8A] hover:underline">8. Admin Dashboard</Link>
        </div>
      </div>
      </ExamProvider>
    </BrowserRouter>
  );
}