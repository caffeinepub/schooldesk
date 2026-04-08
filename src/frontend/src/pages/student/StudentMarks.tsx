import { useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useMarksByStudent } from "../../hooks/useBackend";
import type { Mark } from "../../types";

function getGradeColor(percentage: number): string {
  if (percentage >= 90) return "text-accent";
  if (percentage >= 75) return "text-primary";
  if (percentage >= 50) return "text-[oklch(0.6_0.16_55)]";
  return "text-destructive";
}

function getMarkScore(m: Mark): number {
  return m.score ?? m.marks ?? 0;
}
function getMarkMaxScore(m: Mark): number {
  return m.maxScore ?? m.maxMarks ?? 0;
}
function getMarkDate(m: Mark): Date {
  const raw = m.date as unknown;
  if (typeof raw === "bigint") return new Date(Number(raw) / 1_000_000);
  return new Date(raw as string);
}
function buildChartData(marks: Mark[]) {
  const sorted = [...marks].sort(
    (a, b) => getMarkDate(a).getTime() - getMarkDate(b).getTime(),
  );
  return sorted.map((m) => {
    const score = getMarkScore(m);
    const maxScore = getMarkMaxScore(m);
    return {
      date: getMarkDate(m).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      score: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      subject: m.subject,
    };
  });
}

function buildSubjectTable(marks: Mark[]) {
  const map = new Map<string, { total: number; count: number; best: number }>();
  for (const m of marks) {
    const score = getMarkScore(m);
    const maxScore = getMarkMaxScore(m);
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const existing = map.get(m.subject);
    if (existing) {
      existing.total += pct;
      existing.count += 1;
      existing.best = Math.max(existing.best, pct);
    } else {
      map.set(m.subject, { total: pct, count: 1, best: pct });
    }
  }
  return Array.from(map.entries()).map(([subject, { total, count, best }]) => ({
    subject,
    avg: Math.round(total / count),
    best,
    count,
  }));
}

export default function StudentMarks() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: marks, isLoading } = useMarksByStudent(userProfile?.id ?? "");

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "profile") navigate({ to: "/student/profile" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };

  if (isLoading) return <PageLoader />;

  const chartData = marks ? buildChartData(marks) : [];
  const subjectTable = marks ? buildSubjectTable(marks) : [];
  const overallAvg =
    marks && marks.length > 0
      ? Math.round(
          marks.reduce((s, m) => {
            const score = getMarkScore(m);
            const maxScore = getMarkMaxScore(m);
            return s + (maxScore > 0 ? (score / maxScore) * 100 : 0);
          }, 0) / marks.length,
        )
      : 0;

  return (
    <Layout activeTab="home" onTabChange={handleTabChange} title="My Marks">
      <div className="px-4 pt-4 pb-4 space-y-4">
        {!marks || marks.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No marks yet"
            description="Your exam results will appear here once entered by your teacher."
            data-ocid="empty-marks"
          />
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-2" data-ocid="marks-summary">
              {[
                { label: "Average", value: `${overallAvg}%` },
                { label: "Assessments", value: marks.length },
                { label: "Subjects", value: subjectTable.length },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-card border border-border rounded-xl p-3 shadow-card text-center role-student"
                >
                  <p className="font-display font-bold text-xl text-foreground">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Trend chart */}
            {chartData.length >= 2 && (
              <div
                className="bg-card border border-border rounded-xl p-4 shadow-card"
                data-ocid="marks-chart"
              >
                <h3 className="font-display font-semibold text-sm text-foreground mb-3">
                  Score Trend
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.9 0.008 260)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "oklch(0.5 0.01 260)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: "oklch(0.5 0.01 260)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Score"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid oklch(0.9 0.008 260)",
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="oklch(0.42 0.14 265)"
                      strokeWidth={2}
                      dot={{ fill: "oklch(0.42 0.14 265)", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Subject-wise table */}
            <div
              className="bg-card border border-border rounded-xl shadow-card overflow-hidden"
              data-ocid="marks-subjects"
            >
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Subject-wise Summary
                </h3>
              </div>
              <div className="divide-y divide-border">
                {subjectTable.map(({ subject, avg, best, count }) => (
                  <div
                    key={subject}
                    className="px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {subject}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {count} assessment{count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-base font-bold ${getGradeColor(avg)}`}
                      >
                        {avg}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Best: {best}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All marks list */}
            <div>
              <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5">
                All Results
              </h3>
              <div className="space-y-2" data-ocid="marks-list">
                {[...marks]
                  .sort(
                    (a, b) =>
                      getMarkDate(b).getTime() - getMarkDate(a).getTime(),
                  )
                  .map((mark) => {
                    const score = getMarkScore(mark);
                    const maxScore = getMarkMaxScore(mark);
                    const pct =
                      maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
                    const label =
                      (mark.assessmentName as string | undefined) ??
                      mark.examType ??
                      "";
                    return (
                      <div
                        key={mark.id}
                        className="bg-card border border-border rounded-xl p-3.5 shadow-card role-student"
                        data-ocid={`mark-row-${mark.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-foreground">
                              {mark.subject}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {label} ·{" "}
                              {getMarkDate(mark).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                            {mark.remarks && (
                              <p className="text-xs text-muted-foreground mt-0.5 italic">
                                {mark.remarks}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-base text-foreground">
                              {score}/{maxScore}
                            </p>
                            <p
                              className={`text-xs font-semibold ${getGradeColor(pct)}`}
                            >
                              {mark.grade} · {pct}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
