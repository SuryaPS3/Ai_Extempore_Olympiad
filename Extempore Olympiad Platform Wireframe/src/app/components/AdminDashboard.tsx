import { Fragment, useEffect, useMemo, useState } from "react";
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

type SubmissionStatus = "PENDING" | "APPROVED" | string;

interface AdminSubmission {
  id: number;
  student_id: string;
  grade_level: string;
  round_number: number;
  audio_url: string;
  transcript: string | null;
  ai_feedback: string | null;
  ai_score: number | null;
  final_score: number | null;
  status: SubmissionStatus;
}

const API_URL = "http://localhost:8000/api/submissions";

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
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string>("reviews");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | SubmissionStatus>("ALL");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [scoreOverrides, setScoreOverrides] = useState<Record<number, number>>({});
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<number, string>>({});
  const [savingApprovalIds, setSavingApprovalIds] = useState<Record<number, boolean>>({});
  const [savingFeedbackIds, setSavingFeedbackIds] = useState<Record<number, boolean>>({});

  const fetchSubmissions = async (signal?: AbortSignal) => {
    try {
      const response = await fetch(API_URL, { signal });
      if (!response.ok) {
        throw new Error(`Failed to load submissions (${response.status})`);
      }

      const data = (await response.json()) as Array<Record<string, unknown>>;
      const normalized = data.map((item) => {
        const aiScore = item.ai_score;
        const finalScore = item.final_score;
        return {
          id: Number(item.id),
          student_id: String(item.student_id ?? ""),
          grade_level: String(item.grade_level ?? ""),
          round_number: Number(item.round_number ?? 0),
          audio_url: String(item.audio_url ?? ""),
          transcript: item.transcript ? String(item.transcript) : null,
          ai_feedback: item.ai_feedback ? String(item.ai_feedback) : null,
          ai_score: typeof aiScore === "number" ? aiScore : aiScore ? Number(aiScore) : null,
          final_score:
            typeof finalScore === "number"
              ? finalScore
              : finalScore
                ? Number(finalScore)
                : null,
          status: String(item.status ?? "PENDING").toUpperCase(),
        } satisfies AdminSubmission;
      });

      setSubmissions(normalized);
      setError(null);
      setLoading(false);
    } catch (fetchError) {
      if (signal?.aborted) return;
      console.error("Failed to fetch submissions:", fetchError);
      setError("Could not load live submissions from the server.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    void fetchSubmissions(controller.signal);
    const intervalId = window.setInterval(() => {
      void fetchSubmissions();
    }, 5000);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setFeedbackDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };
      submissions.forEach((submission) => {
        if (!(submission.id in nextDrafts)) {
          nextDrafts[submission.id] = submission.ai_feedback ?? "";
        }
      });
      return nextDrafts;
    });
  }, [submissions]);

  const mergedSubmissions = useMemo(
    () =>
      submissions.map((submission) => ({
        ...submission,
        final_score: scoreOverrides[submission.id] ?? submission.final_score,
      })),
    [submissions, scoreOverrides]
  );

  const grades = useMemo(
    () => [...new Set(mergedSubmissions.map((s) => s.grade_level))].sort(),
    [mergedSubmissions]
  );

  const stats = useMemo(() => {
    const pending = mergedSubmissions.filter((s) => s.status === "PENDING").length;
    const approved = mergedSubmissions.filter((s) => s.status === "APPROVED").length;
    const scored = mergedSubmissions.filter((s) => typeof s.final_score === "number");
    const avgScore =
      scored.length === 0
        ? 0
        : scored.reduce((sum, s) => sum + (s.final_score ?? 0), 0) / scored.length;
    return {
      pending,
      approved,
      total: mergedSubmissions.length,
      avgScore: avgScore.toFixed(1),
    };
  }, [mergedSubmissions]);

  const filteredSubmissions = useMemo(() => {
    return mergedSubmissions.filter((submission) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        submission.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (submission.transcript ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || submission.status === statusFilter;
      const matchesGrade =
        gradeFilter === "ALL" || submission.grade_level === gradeFilter;
      return matchesSearch && matchesStatus && matchesGrade;
    });
  }, [mergedSubmissions, searchQuery, statusFilter, gradeFilter]);

  const toggleExpanded = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const getOverrideScore = (submission: AdminSubmission) =>
    scoreOverrides[submission.id] ?? submission.final_score;

  const updateSubmission = async (
    submissionId: number,
    payload: Record<string, unknown>
  ) => {
    const response = await fetch(`${API_URL}/${submissionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update submission (${response.status})`);
    }

    return (await response.json()) as AdminSubmission;
  };

  const handleScoreChange = (id: number, value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    setScoreOverrides((prev) => ({
      ...prev,
      [id]: Math.min(100, Math.max(0, parsed)),
    }));
  };

  const handleApprove = (id: number) => {
    const submission = submissions.find((item) => item.id === id);
    const override = scoreOverrides[id] ?? submission?.final_score ?? 0;

    setSavingApprovalIds((prev) => ({ ...prev, [id]: true }));
    void updateSubmission(id, {
      status: "APPROVED",
      final_score: override,
    })
      .then((updatedSubmission) => {
        setSubmissions((prev) =>
          prev.map((item) => (item.id === id ? updatedSubmission : item))
        );
        setScoreOverrides((prev) => {
          const nextOverrides = { ...prev };
          delete nextOverrides[id];
          return nextOverrides;
        });
      })
      .catch((updateError) => {
        console.error("Failed to approve submission:", updateError);
        setError("Could not save the approved score.");
      })
      .finally(() => {
        setSavingApprovalIds((prev) => ({ ...prev, [id]: false }));
      });
  };

  const handleFeedbackSave = (id: number) => {
    const feedback = feedbackDrafts[id] ?? "";
    setSavingFeedbackIds((prev) => ({ ...prev, [id]: true }));

    void updateSubmission(id, { ai_feedback: feedback })
      .then((updatedSubmission) => {
        setSubmissions((prev) =>
          prev.map((item) => (item.id === id ? updatedSubmission : item))
        );
        setFeedbackDrafts((prev) => ({
          ...prev,
          [id]: updatedSubmission.ai_feedback ?? "",
        }));
      })
      .catch((updateError) => {
        console.error("Failed to save AI feedback:", updateError);
        setError("Could not save the AI feedback override.");
      })
      .finally(() => {
        setSavingFeedbackIds((prev) => ({ ...prev, [id]: false }));
      });
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
            {error && (
              <p className="mt-3 text-sm text-[#B91C1C]">
                {error}
              </p>
            )}
            {loading && (
              <p className="mt-3 text-sm text-[#64748B]">
                Loading live submissions...
              </p>
            )}
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
                            {submission.ai_score ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-center font-semibold text-[#1E293B]">
                            {submission.final_score ?? "—"}
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
                                      value={submission.transcript ?? ""}
                                      className="w-full h-40 resize-none rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#1E293B] focus:outline-none"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <p className="text-xs uppercase tracking-wider text-[#64748B]">
                                        Submission Summary
                                      </p>
                                      <span className="text-sm font-bold text-[#1B6B8A]">
                                        {submission.ai_score ?? 0} / 100
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                      <div className="rounded-md bg-[#F8FAFC] p-3">
                                        <p className="text-[#64748B] text-xs uppercase tracking-wider mb-1">
                                          Audio URL
                                        </p>
                                        <p className="text-[#1E293B] break-all">
                                          {submission.audio_url || "No file attached"}
                                        </p>
                                      </div>
                                      <div className="rounded-md bg-[#F8FAFC] p-3">
                                        <p className="text-[#64748B] text-xs uppercase tracking-wider mb-1">
                                          AI Score
                                        </p>
                                        <p className="text-[#1E293B] font-medium">
                                          {submission.ai_score ?? "—"}
                                        </p>
                                      </div>
                                      <div className="rounded-md bg-[#F8FAFC] p-3">
                                        <p className="text-[#64748B] text-xs uppercase tracking-wider mb-1">
                                          Final Score
                                        </p>
                                        <p className="text-[#1E293B] font-medium">
                                          {submission.final_score ?? "—"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs uppercase tracking-wider text-[#64748B] mb-2">
                                      AI Feedback
                                    </p>
                                    <textarea
                                      value={feedbackDrafts[submission.id] ?? submission.ai_feedback ?? ""}
                                      onChange={(e) =>
                                        setFeedbackDrafts((prev) => ({
                                          ...prev,
                                          [submission.id]: e.target.value,
                                        }))
                                      }
                                      className="w-full h-40 resize-none rounded-md border border-[#CBD5E1] bg-white p-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1B6B8A]"
                                      placeholder="Add or override the AI explanation here..."
                                    />
                                    <button
                                      onClick={() => handleFeedbackSave(submission.id)}
                                      disabled={savingFeedbackIds[submission.id]}
                                      className="mt-3 w-full h-11 bg-[#374151] text-white font-semibold rounded-md hover:bg-[#1F2937] disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] disabled:cursor-not-allowed transition-colors"
                                    >
                                      {savingFeedbackIds[submission.id]
                                        ? "Saving Feedback..."
                                        : "Save AI Feedback"}
                                    </button>
                                  </div>
                                  <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2">
                                      Final Score Override
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={getOverrideScore(submission) ?? ""}
                                      onChange={(e) =>
                                        handleScoreChange(submission.id, e.target.value)
                                      }
                                      className="w-full h-11 px-3 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1B6B8A]"
                                    />
                                    <button
                                      onClick={() => handleApprove(submission.id)}
                                      disabled={submission.status === "APPROVED" || savingApprovalIds[submission.id]}
                                      className="mt-4 w-full h-11 bg-[#1B6B8A] text-white font-semibold rounded-md hover:bg-[#155A72] disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] disabled:cursor-not-allowed transition-colors"
                                    >
                                      {savingApprovalIds[submission.id]
                                        ? "Saving Approval..."
                                        : submission.status === "APPROVED"
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
