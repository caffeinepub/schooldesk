import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { DollarSign, Printer } from "lucide-react";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useFeesByStudent } from "../../hooks/useBackend";
import type { FeeRecord } from "../../types";

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function handlePrintReceipt(fee: FeeRecord) {
  const printContent = `
    <html><head><title>Fee Receipt</title>
    <style>
      body { font-family: sans-serif; padding: 24px; }
      h2 { color: #1a1a2e; margin-bottom: 4px; }
      .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
      td:last-child { text-align: right; font-weight: 600; }
      .total { font-size: 16px; font-weight: 700; }
      .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    </style>
    </head><body>
    <h2>SchoolDesk — Fee Receipt</h2>
    <p class="meta">${fee.studentName} · GR No: ${fee.grNo} · Class: ${fee.className}</p>
    <table>
      <tr><td>Fee Type</td><td>${fee.feeType}</td></tr>
      <tr><td>Month / Year</td><td>${fee.month} ${fee.year}</td></tr>
      <tr><td>Due Date</td><td>${fee.dueDate}</td></tr>
      ${fee.paidDate ? `<tr><td>Paid Date</td><td>${fee.paidDate}</td></tr>` : ""}
      <tr><td>Amount</td><td>${formatCurrency(fee.amount)}</td></tr>
      <tr><td>Paid Amount</td><td>${formatCurrency(fee.paidAmount)}</td></tr>
      <tr class="total"><td>Status</td><td><span class="badge">${fee.status.toUpperCase()}</span></td></tr>
    </table>
    <p style="margin-top:24px;font-size:12px;color:#888;">Generated on ${new Date().toLocaleDateString("en-IN")}</p>
    </body></html>
  `;
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(printContent);
    win.document.close();
    win.print();
  }
}

export default function StudentFees() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: fees, isLoading } = useFeesByStudent(userProfile?.id ?? "");

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "profile") navigate({ to: "/student/profile" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };

  if (isLoading) return <PageLoader />;

  const totalAmount = (fees ?? []).reduce((s, f) => s + f.amount, 0);
  const totalPaid = (fees ?? []).reduce((s, f) => s + f.paidAmount, 0);
  const outstanding = totalAmount - totalPaid;
  const hasUnpaid = outstanding > 0;

  return (
    <Layout activeTab="home" onTabChange={handleTabChange} title="My Fees">
      <div className="px-4 pt-4 pb-4 space-y-4">
        {fees && fees.length > 0 && (
          /* Balance summary card */
          <div
            className={`bg-card border rounded-xl p-4 shadow-card role-student ${
              hasUnpaid ? "border-destructive/30" : "border-border"
            }`}
            data-ocid="fees-summary"
          >
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
              Outstanding Balance
            </p>
            <p
              className={`font-display font-bold text-3xl leading-tight ${
                hasUnpaid ? "text-destructive" : "text-accent"
              }`}
            >
              {formatCurrency(outstanding)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Total Fees</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Paid</p>
                <p className="text-sm font-semibold text-accent mt-0.5">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
            </div>
            {totalAmount > 0 && (
              <div className="mt-3">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-smooth"
                    style={{
                      width: `${Math.min(100, Math.round((totalPaid / totalAmount) * 100))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {Math.round((totalPaid / totalAmount) * 100)}% paid
                </p>
              </div>
            )}
          </div>
        )}

        {!fees || fees.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No fee records"
            description="Your fee records will appear here once created by the admin."
            data-ocid="empty-fees"
          />
        ) : (
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider px-0.5">
              Fee Records
            </h3>
            {fees.map((fee) => (
              <div
                key={fee.id}
                className="bg-card border border-border rounded-xl p-3.5 shadow-card"
                data-ocid={`fee-row-${fee.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground">
                        {fee.feeType}
                      </p>
                      <StatusBadge status={fee.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {fee.month} {fee.year} · Due:{" "}
                      {new Date(fee.dueDate).toLocaleDateString("en-IN")}
                    </p>
                    {fee.remarks && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">
                        {fee.remarks}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-foreground">
                      {formatCurrency(fee.amount)}
                    </p>
                    {fee.paidAmount > 0 && (
                      <p className="text-xs text-accent">
                        Paid: {formatCurrency(fee.paidAmount)}
                      </p>
                    )}
                  </div>
                </div>
                {fee.status === "paid" && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs gap-1.5"
                      onClick={() => handlePrintReceipt(fee)}
                      data-ocid={`btn-receipt-${fee.id}`}
                    >
                      <Printer size={13} /> Download Receipt
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
