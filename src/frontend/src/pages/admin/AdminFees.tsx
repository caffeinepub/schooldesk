import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, DollarSign, Filter, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { StatusBadge } from "../../components/StatusBadge";
import { useAllFees, useMarkFeePaid } from "../../hooks/useBackend";
import type { FeeRecord, FeeStatus } from "../../types";

type FilterTab = "all" | FeeStatus;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "paid", label: "Paid" },
  { id: "unpaid", label: "Unpaid" },
  { id: "late", label: "Late" },
  { id: "partial", label: "Partial" },
];

function printReceipt(fee: FeeRecord) {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`
    <html><head><title>Fee Receipt</title>
    <style>
      body{font-family:sans-serif;padding:40px;max-width:480px;margin:auto}
      h2{color:#1e1b4b}
      table{width:100%;border-collapse:collapse;margin-top:16px}
      td{padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:14px}
      td:last-child{text-align:right;font-weight:600}
      .badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:12px;
        background:${fee.status === "paid" ? "#dcfce7" : "#fef3c7"};color:${fee.status === "paid" ? "#166534" : "#92400e"}}
      .footer{margin-top:32px;font-size:12px;color:#9ca3af;text-align:center}
    </style></head><body>
    <h2>SchoolDesk — Fee Receipt</h2>
    <p style="color:#6b7280;font-size:13px">Generated: ${new Date().toLocaleString()}</p>
    <table>
      <tr><td>Student Name</td><td>${fee.studentName}</td></tr>
      <tr><td>GR Number</td><td>${fee.grNo}</td></tr>
      <tr><td>Class</td><td>${fee.className}</td></tr>
      <tr><td>Fee Type</td><td>${fee.feeType}</td></tr>
      <tr><td>Month / Year</td><td>${fee.month} ${fee.year}</td></tr>
      <tr><td>Total Amount</td><td>₹${fee.amount.toLocaleString()}</td></tr>
      <tr><td>Amount Paid</td><td>₹${fee.paidAmount.toLocaleString()}</td></tr>
      <tr><td>Due Date</td><td>${fee.dueDate}</td></tr>
      <tr><td>Status</td><td><span class="badge">${fee.status.toUpperCase()}</span></td></tr>
    </table>
    <p class="footer">SchoolDesk · Official Fee Receipt</p>
    </body></html>
  `);
  w.document.close();
  w.print();
}

export default function AdminFees() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [payDialog, setPayDialog] = useState<FeeRecord | null>(null);
  const [paidAmount, setPaidAmount] = useState("");

  const { data: fees = [], isLoading } = useAllFees();
  const markFeePaid = useMarkFeePaid();

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };

  const filtered = useMemo(
    () => (filter === "all" ? fees : fees.filter((f) => f.status === filter)),
    [fees, filter],
  );

  const totalCollected = fees.reduce((s, f) => s + f.paidAmount, 0);
  const totalDue = fees.reduce((s, f) => s + f.amount, 0);
  const collectPct =
    totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 0;

  function openPayDialog(f: FeeRecord) {
    setPayDialog(f);
    setPaidAmount(String(f.amount - f.paidAmount));
  }

  async function handleMarkPaid() {
    if (!payDialog) return;
    const amount = Number.parseFloat(paidAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await markFeePaid.mutateAsync({ id: payDialog.id, paidAmount: amount });
      toast.success("Fee marked as paid");
      setPayDialog(null);
    } catch {
      toast.error("Failed to update fee");
    }
  }

  return (
    <Layout activeTab="home" onTabChange={handleTabChange} title="Fees">
      <div className="px-4 pt-4 pb-4 space-y-3">
        {/* Summary */}
        <div className="bg-card border border-border rounded-xl shadow-card p-4 role-admin">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={15} className="text-primary" />
            <span className="font-display font-semibold text-sm text-foreground">
              Collection Summary
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Due</span>
              <span className="font-semibold text-foreground">
                ₹{totalDue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Collected</span>
              <span className="font-semibold text-accent">
                ₹{totalCollected.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-accent h-2 rounded-full transition-smooth"
                style={{ width: `${Math.min(collectPct, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {collectPct}% collected
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-0.5"
          data-ocid="fee-filter-tabs"
        >
          <Filter size={13} className="text-muted-foreground flex-shrink-0" />
          {FILTER_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              data-ocid={`filter-${id}`}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filter === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner label="Loading fees…" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No fee records"
            description="No records match the selected filter."
            data-ocid="empty-fees"
          />
        ) : (
          <div className="space-y-2" data-ocid="fees-list">
            {filtered.map((fee) => (
              <div
                key={fee.id}
                className="bg-card border border-border rounded-xl p-3.5 shadow-card"
                data-ocid={`fee-row-${fee.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {fee.studentName}
                      </p>
                      <StatusBadge status={fee.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {fee.className}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {fee.feeType} · {fee.month} {fee.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-semibold text-foreground">
                        ₹{fee.amount.toLocaleString()}
                      </span>
                      {fee.paidAmount > 0 && fee.paidAmount < fee.amount && (
                        <span className="text-xs text-accent">
                          Paid: ₹{fee.paidAmount.toLocaleString()}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Due: {fee.dueDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {fee.status !== "paid" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-accent border-accent/30 hover:bg-accent/10"
                        onClick={() => openPayDialog(fee)}
                        data-ocid={`btn-mark-paid-${fee.id}`}
                      >
                        <CheckCircle size={11} className="mr-1" />
                        Pay
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={() => printReceipt(fee)}
                      aria-label="Print receipt"
                      data-ocid={`btn-receipt-${fee.id}`}
                    >
                      <Printer size={11} className="mr-1" />
                      Receipt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pay Dialog */}
      <Dialog open={!!payDialog} onOpenChange={(o) => !o && setPayDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Mark Fee as Paid</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Student: </span>
                <strong>{payDialog?.studentName}</strong>
              </p>
              <p>
                <span className="text-muted-foreground">Total: </span>
                <strong>₹{payDialog?.amount.toLocaleString()}</strong>
              </p>
              <p>
                <span className="text-muted-foreground">Already Paid: </span>
                <strong>₹{payDialog?.paidAmount.toLocaleString()}</strong>
              </p>
            </div>
            <div>
              <Label htmlFor="paid-amount" className="text-xs font-medium">
                Amount Received (₹)
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="paid-amount"
                type="number"
                min="1"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="mt-1"
                data-ocid="input-paid-amount"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPayDialog(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleMarkPaid}
                disabled={markFeePaid.isPending}
                data-ocid="btn-confirm-pay"
              >
                {markFeePaid.isPending ? "Processing…" : "Confirm Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
