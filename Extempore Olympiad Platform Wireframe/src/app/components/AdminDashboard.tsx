import { Fragment, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Search,
  Settings,
  Shield,
} from "lucide-react";

type SubmissionStatus = "PENDING" | "APPROVED";

interface RubricScores {
  content: number;
  clarity: number;
  confidence: number;
  creativity: number;
  timeManagement: number;
  overallImpact: number;
}

interface AdminSubmission {
  id: number;
  student_id: string;
  grade_level: string;
  round_number: number;
  audio_url: string;
  transcript: string;
  ai_feedback: string;
  ai_score: number;
  rubric: RubricScores;
  final_score: number;
  status: SubmissionStatus;
}

const RUBRIC_LABELS: { key: keyof RubricScores; label: string; max: number }[] = [
  { key: "content", label: "Content", max: 20 },
  { key: "clarity", label: "Clarity", max: 20 },
  { key: "confidence", label: "Confidence", max: 15 },
  { key: "creativity", label: "Creativity", max: 15 },
  { key: "timeManagement", label: "Time Management", max: 15 },
  { key: "overallImpact", label: "Overall Impact", max: 15 },
];

const INITIAL_SUBMISSIONS: AdminSubmission[] = [
  {
    id: 1,
    student_id: "STU-1042",
    grade_level: "Class 6",
    round_number: 1,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    transcript:
      "If I became President of America for one day, the first thing I would do is make school lunches free for every child. I would also plant trees in every neighborhood and ask scientists to help us clean the oceans. I believe children should have a voice in decisions because we are the future.",
    ai_feedback:
      "Strong topical relevance with a clear opening. Ideas are well structured, though transitions between policy points could be smoother.",
    ai_score: 82,
    rubric: {
      content: 17,
      clarity: 16,
      confidence: 13,
      creativity: 14,
      timeManagement: 12,
      overallImpact: 10,
    },
    final_score: 82,
    status: "PENDING",
  },
  {
    id: 2,
    student_id: "STU-1042",
    grade_level: "Class 6",
    round_number: 2,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    transcript:
      "In a world where animals could talk, the first change would be at breakfast. My dog would complain about cereal, and birds would negotiate traffic rules from the sky. Schools would hire dolphins as swimming coaches, and cats would finally explain why they knock things off tables.",
    ai_feedback:
      "Highly creative narrative with vivid imagery. Pacing is energetic; a stronger conclusion would elevate the overall impact.",
    ai_score: 88,
    rubric: {
      content: 16,
      clarity: 17,
      confidence: 14,
      creativity: 18,
      timeManagement: 13,
      overallImpact: 10,
    },
    final_score: 88,
    status: "PENDING",
  },
  {
    id: 3,
    student_id: "STU-1042",
    grade_level: "Class 6",
    round_number: 3,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    transcript:
      "Across the galaxy, a whisper traveled over an old bridge built with courage. The speaker used each mystery word naturally while describing a journey between stars, showing that bravery connects people even when worlds feel far apart.",
    ai_feedback:
      "All challenge words were integrated successfully. Delivery was confident, but some sentences were rushed near the end.",
    ai_score: 79,
    rubric: {
      content: 15,
      clarity: 15,
      confidence: 14,
      creativity: 13,
      timeManagement: 11,
      overallImpact: 11,
    },
    final_score: 79,
    status: "PENDING",
  },
  {
    id: 4,
    student_id: "STU-2091",
    grade_level: "Class 8",
    round_number: 1,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    transcript:
      "For one presidential day, I would focus on mental health support in schools and safer cycling lanes in cities. Students need counselors, not just exams, and cities need space where families can move without fear.",
    ai_feedback:
      "Mature perspective with policy-aware examples. Excellent clarity and confidence throughout the response.",
    ai_score: 91,
    rubric: {
      content: 18,
      clarity: 18,
      confidence: 15,
      creativity: 12,
      timeManagement: 14,
      overallImpact: 14,
    },
    final_score: 91,
    status: "APPROVED",
  },
  {
    id: 5,
    student_id: "STU-2091",
    grade_level: "Class 8",
    round_number: 2,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    transcript:
      "Talking animals would transform hospitals first. Dogs could calm patients, parrots could repeat medicine schedules, and elephants could carry supplies in flood zones. Communication would make compassion faster.",
    ai_feedback:
      "Original angle with social relevance. Strong confidence, though one section repeated similar examples.",
    ai_score: 86,
    rubric: {
      content: 17,
      clarity: 17,
      confidence: 14,
      creativity: 16,
      timeManagement: 12,
      overallImpact: 10,
    },
    final_score: 86,
    status: "APPROVED",
  },
  {
    id: 6,
    student_id: "STU-3310",
    grade_level: "Class 5",
    round_number: 1,
    audio_url: "",
    transcript:
      "I would make parks bigger and give every kid a library card. I also want free art classes because drawing helps me think.",
    ai_feedback:
      "Sweet and sincere delivery. Content is relevant but brief; expanding with one concrete example would help.",
    ai_score: 71,
    rubric: {
      content: 14,
      clarity: 14,
      confidence: 11,
      creativity: 12,
      timeManagement: 10,
      overallImpact: 10,
    },
    final_score: 71,
    status: "PENDING",
  },
  {
    id: 7,
    student_id: "STU-3310",
    grade_level: "Class 5",
    round_number: 2,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    transcript:
      "If animals talked, my hamster would ask for quieter nights and my fish would request warmer water. The funniest part is cows would start podcasting about grass quality.",
    ai_feedback:
      "Playful and memorable. Good use of humor; clarity dips slightly when multiple jokes are stacked together.",
    ai_score: 76,
    rubric: {
      content: 14,
      clarity: 13,
      confidence: 12,
      creativity: 15,
      timeManagement: 11,
      overallImpact: 11,
    },
    final_score: 76,
    status: "PENDING",
  },
  {
    id: 8,
    student_id: "STU-4477",
    grade_level: "Class 10",
    round_number: 3,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    transcript:
      "A whisper in the galaxy crossed a bridge of courage, linking two civilizations that had stopped listening. The story argued that empathy is the real technology of peace.",
    ai_feedback:
      "Sophisticated vocabulary and thematic depth. Excellent overall impact with controlled pacing.",
    ai_score: 94,
    rubric: {
      content: 19,
      clarity: 18,
      confidence: 15,
      creativity: 15,
      timeManagement: 14,
      overallImpact: 13,
    },
    final_score: 94,
    status: "PENDING",
  },
];

const MENU_ITEMS = [
  { id: "reviews", label: "Submission Reviews", icon: ClipboardCheck },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

function roundLabel(round: number) {
  if (round === 1) return "Warm Up";
  if (round === 2) return "Creative";
  return "Challenge";
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] px-3 py-1 rounded-full text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        APPROVED
      </span>
    );
  }
  return (
    <span className="bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full text-xs font-semibold">
      PENDING
    </span>
  );
}

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [selectedMenu, setSelectedMenu] = useState<string>("reviews");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | SubmissionStatus>("ALL");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [scoreOverrides, setScoreOverrides] = useState<Record<number, number>>({});

  const grades = useMemo(
    () => [...new Set(submissions.map((s) => s.grade_level))].sort(),
    [submissions]
  );

  const stats = useMemo(() => {
    const pending = submissions.filter((s) => s.status === "PENDING").length;
    const approved = submissions.filter((s) => s.status === "APPROVED").length;
    const avgScore =
      submissions.reduce((sum, s) => sum + s.final_score, 0) / submissions.length;
    return {
      pending,
      approved,
      total: submissions.length,
      avgScore: avgScore.toFixed(1),
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        submission.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.transcript.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || submission.status === statusFilter;
      const matchesGrade =
        gradeFilter === "ALL" || submission.grade_level === gradeFilter;
      return matchesSearch && matchesStatus && matchesGrade;
    });
  }, [submissions, searchQuery, statusFilter, gradeFilter]);

  const toggleExpanded = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const getOverrideScore = (submission: AdminSubmission) =>
    scoreOverrides[submission.id] ?? submission.final_score;

  const handleScoreChange = (id: number, value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    setScoreOverrides((prev) => ({
      ...prev,
      [id]: Math.min(100, Math.max(0, parsed)),
    }));
  };

  const handleApprove = (id: number) => {
    const override = scoreOverrides[id];
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id
          ? {
              ...submission,
              status: "APPROVED",
              final_score: override ?? submission.final_score,
            }
          : submission
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28">
      <div className="flex min-h-[calc(100vh-7rem)]">
        <aside className="w-64 shrink-0 bg-white border-r border-[#E2E8F0] p-5">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-9 h-9 bg-[#1B6B8A] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1E293B]">Admin Console</p>
              <p className="text-xs text-[#64748B]">Extempore Olympiad</p>
            </div>
          </div>
          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = selectedMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedMenu(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#E0F2FE] text-[#1B6B8A] border-l-4 border-[#1B6B8A]"
                      : "text-[#475569] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8 max-w-[1180px]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1E293B]">Submission Reviews</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Review AI-graded audio responses and approve final scores.
            </p>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
              <p className="text-sm text-[#64748B]">Pending</p>
              <p className="text-3xl font-bold text-[#F97316]">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
              <p className="text-sm text-[#64748B]">Approved</p>
              <p className="text-3xl font-bold text-[#22C55E]">{stats.approved}</p>
            </div>
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
              <p className="text-sm text-[#64748B]">Total Submissions</p>
              <p className="text-3xl font-bold text-[#2563EB]">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
              <p className="text-sm text-[#64748B]">Avg Final Score</p>
              <p className="text-3xl font-bold text-[#1B6B8A]">{stats.avgScore}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 mb-4 flex flex-wrap gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student ID or transcript..."
                className="w-full h-11 pl-10 pr-4 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1B6B8A]"
              />
            </div>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="h-11 px-4 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1B6B8A]"
            >
              <option value="ALL">All Grades</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | SubmissionStatus)
              }
              className="h-11 px-4 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1B6B8A]"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px]">
                <thead>
                  <tr className="bg-[#1B6B8A] text-white text-sm">
                    <th className="w-10 px-3 py-3" />
                    <th className="text-left px-4 py-3 font-semibold">Student ID</th>
                    <th className="text-left px-4 py-3 font-semibold">Grade</th>
                    <th className="text-left px-4 py-3 font-semibold">Round</th>
                    <th className="text-center px-4 py-3 font-semibold">AI Score</th>
                    <th className="text-center px-4 py-3 font-semibold">Final Score</th>
                    <th className="text-center px-4 py-3 font-semibold">Status</th>
                    <th className="text-center px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission, index) => {
                    const isExpanded = expandedId === submission.id;
                    return (
                      <Fragment key={submission.id}>
                        <tr
                          className={`cursor-pointer transition-colors ${
                            isExpanded
                              ? "bg-[#E0F2FE]"
                              : index % 2 === 0
                                ? "bg-white hover:bg-[#F8FAFC]"
                                : "bg-[#F8FAFC] hover:bg-[#F1F5F9]"
                          }`}
                          onClick={() => toggleExpanded(submission.id)}
                        >
                          <td className="px-3 py-3 text-[#64748B]">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#1E293B]">
                            {submission.student_id}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#475569]">
                            {submission.grade_level}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#475569]">
                            R{submission.round_number} — {roundLabel(submission.round_number)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center font-semibold text-[#1B6B8A]">
                            {submission.ai_score}
                          </td>
                          <td className="px-4 py-3 text-sm text-center font-semibold text-[#1E293B]">
                            {submission.final_score}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <StatusBadge status={submission.status} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(submission.id);
                              }}
                              className="border border-[#1B6B8A] text-[#1B6B8A] px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-[#E0F2FE]"
                            >
                              {isExpanded ? "Close" : "Review"}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-[#F8FAFC]">
                            <td colSpan={8} className="px-6 py-6 border-t border-[#E2E8F0]">
                              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs uppercase tracking-wider text-[#64748B] mb-3">
                                      Audio Recording
                                    </p>
                                    {submission.audio_url ? (
                                      <audio
                                        controls
                                        src={submission.audio_url}
                                        className="w-full"
                                      />
                                    ) : (
                                      <p className="text-sm text-[#94A3B8] italic">
                                        No audio file attached for this submission.
                                      </p>
                                    )}
                                  </div>
                                  <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs uppercase tracking-wider text-[#64748B] mb-3">
                                      Transcript
                                    </p>
                                    <textarea
                                      readOnly
                                      value={submission.transcript}
                                      className="w-full h-40 resize-none rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#1E293B] focus:outline-none"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <p className="text-xs uppercase tracking-wider text-[#64748B]">
                                        AI Rubric Breakdown
                                      </p>
                                      <span className="text-sm font-bold text-[#1B6B8A]">
                                        {submission.ai_score} / 100
                                      </span>
                                    </div>
                                    <div className="space-y-3">
                                      {RUBRIC_LABELS.map(({ key, label, max }) => {
                                        const score = submission.rubric[key];
                                        const percent = (score / max) * 100;
                                        return (
                                          <div key={key}>
                                            <div className="flex justify-between text-sm mb-1">
                                              <span className="text-[#475569]">{label}</span>
                                              <span className="font-medium text-[#1E293B]">
                                                {score} / {max}
                                              </span>
                                            </div>
                                            <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                                              <div
                                                className="h-full bg-[#1B6B8A] rounded-full"
                                                style={{ width: `${percent}%` }}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs uppercase tracking-wider text-[#64748B] mb-2">
                                      AI Feedback
                                    </p>
                                    <p className="text-sm text-[#475569] leading-relaxed">
                                      {submission.ai_feedback}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2">
                                      Final Score Override
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={getOverrideScore(submission)}
                                      onChange={(e) =>
                                        handleScoreChange(submission.id, e.target.value)
                                      }
                                      className="w-full h-11 px-3 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1B6B8A]"
                                    />
                                    <button
                                      onClick={() => handleApprove(submission.id)}
                                      disabled={submission.status === "APPROVED"}
                                      className="mt-4 w-full h-11 bg-[#1B6B8A] text-white font-semibold rounded-md hover:bg-[#155A72] disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] disabled:cursor-not-allowed transition-colors"
                                    >
                                      {submission.status === "APPROVED"
                                        ? "Grade Approved"
                                        : "Approve Grade"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredSubmissions.length === 0 && (
              <div className="p-10 text-center text-sm text-[#64748B]">
                No submissions match your current filters.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
