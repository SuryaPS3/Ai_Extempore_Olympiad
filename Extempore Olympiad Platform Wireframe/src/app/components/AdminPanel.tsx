import { useState } from "react";
import { Search, Download } from "lucide-react";

export function AdminPanel() {
  const [selectedMenu, setSelectedMenu] = useState("pending");

  const stats = [
    { label: "Pending", value: 23, color: "text-[#F97316]" },
    { label: "Approved", value: 41, color: "text-[#22C55E]" },
    { label: "Total Students", value: 64, color: "text-[#2563EB]" },
    { label: "Avg Score", value: "74.2", color: "text-[#1B6B8A]" }
  ];

  const students = [
    { name: "Alice Johnson", grade: "Class 6", r1: 18, r2: 26, r3: 42, total: 86, status: "approved" },
    { name: "Bob Smith", grade: "Class 7", r1: 15, r2: 22, r3: 35, total: 72, status: "pending" },
    { name: "Carol Davis", grade: "Class 6", r1: 16, r2: 24, r3: 38, total: 78, status: "pending" },
    { name: "David Wilson", grade: "Class 8", r1: 19, r2: 28, r3: 45, total: 92, status: "approved" },
    { name: "Emma Brown", grade: "Class 5", r1: 14, r2: 20, r3: 30, total: 64, status: "pending" }
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "pending", label: "Pending Reviews" },
    { id: "approved", label: "Approved" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-60 bg-white border-r border-gray-200 min-h-screen p-4">
          <h3 className="font-bold text-[#1E293B] mb-6 px-3">Greenwood School</h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedMenu(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedMenu === item.id
                    ? "bg-[#E0F2FE] text-[#1B6B8A] border-l-4 border-[#1B6B8A]"
                    : "text-[#475569] hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
                <p className="text-sm text-[#475569] mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 mb-4 flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full h-11 pl-10 pr-4 border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B6B8A]"
              />
            </div>
            <select className="h-11 px-4 border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B6B8A]">
              <option>All Grades</option>
              <option>Class 5</option>
              <option>Class 6</option>
              <option>Class 7</option>
              <option>Class 8</option>
            </select>
            <select className="h-11 px-4 border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B6B8A]">
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
            </select>
            <button className="h-11 px-4 border-2 border-[#1B6B8A] text-[#1B6B8A] rounded-md hover:bg-[#E0F2FE] flex items-center gap-2 font-medium">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1B6B8A] text-white text-sm">
                  <th className="text-left px-4 py-3 font-semibold">Student Name</th>
                  <th className="text-center px-4 py-3 font-semibold">Grade</th>
                  <th className="text-center px-4 py-3 font-semibold">R1</th>
                  <th className="text-center px-4 py-3 font-semibold">R2</th>
                  <th className="text-center px-4 py-3 font-semibold">R3</th>
                  <th className="text-center px-4 py-3 font-semibold">Total</th>
                  <th className="text-center px-4 py-3 font-semibold">Status</th>
                  <th className="text-center px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                    <td className="px-4 py-3 text-sm font-medium text-[#1E293B]">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-center text-[#475569]">{student.grade}</td>
                    <td className="px-4 py-3 text-sm text-center text-[#475569]">{student.r1}</td>
                    <td className="px-4 py-3 text-sm text-center text-[#475569]">{student.r2}</td>
                    <td className="px-4 py-3 text-sm text-center text-[#475569]">{student.r3}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-[#1B6B8A]">{student.total}</td>
                    <td className="px-4 py-3 text-center">
                      {student.status === "approved" ? (
                        <span className="bg-[#DCFCE7] text-[#15803D] px-3 py-1 rounded-full text-xs font-medium">
                          Approved ✓
                        </span>
                      ) : (
                        <span className="bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {student.status === "pending" && (
                        <button className="border border-[#1B6B8A] text-[#1B6B8A] px-3 py-1 rounded text-xs font-medium hover:bg-[#E0F2FE]">
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
