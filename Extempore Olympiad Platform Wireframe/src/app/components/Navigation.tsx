import { Link } from "react-router";

export function Navigation() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top White Nav */}
      <div className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#1B6B8A] rounded-lg flex items-center justify-center text-white font-bold text-lg">
            EO
          </div>
          <span className="font-semibold text-[#1B6B8A] text-lg">Extempore Olympiad</span>
        </div>
        <div className="flex gap-6 mx-auto">
          <Link to="/" className="text-gray-700 hover:text-[#1B6B8A] font-medium">Olympiads</Link>
          <Link to="/faqs" className="text-gray-700 hover:text-[#1B6B8A] font-medium">FAQs</Link>
          <Link to="/student-connect" className="text-gray-700 hover:text-[#1B6B8A] font-medium">Student Connect</Link>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#F97316] text-white px-4 py-2 rounded-md font-medium hover:bg-[#EA580C]">
            Subscribe
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50">
            Logout
          </button>
        </div>
      </div>

      {/* Second Teal Nav */}
      <div className="bg-[#1B6B8A] h-11 flex items-center px-6">
        <div className="flex gap-6">
          <Link to="/account" className="text-white hover:text-white/90 text-sm font-medium">Account</Link>
          <Link to="/book-exam" className="text-white hover:text-white/90 text-sm font-medium">Book Slot/Take Exam</Link>
          <Link to="/performance" className="text-white hover:text-white/90 text-sm font-medium">Performance</Link>
          <Link to="/free-trial" className="text-white hover:text-white/90 text-sm font-medium">Free Trial</Link>
        </div>
      </div>
    </div>
  );
}
