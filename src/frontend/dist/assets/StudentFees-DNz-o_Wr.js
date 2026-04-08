import { u as useNavigate, a as useAuth, j as jsxRuntimeExports, P as PageLoader } from "./index-BBwbkILB.js";
import { B as Button } from "./graduation-cap-D7guj77i.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { L as Layout } from "./Layout-8MqYqfzj.js";
import { S as StatusBadge } from "./StatusBadge-YQKFDOVw.js";
import { y as useFeesByStudent } from "./useBackend-slhkZeTo.js";
import { D as DollarSign } from "./dollar-sign-CVQveGAv.js";
import { P as Printer } from "./printer-Bc3ktAjY.js";
function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
function handlePrintReceipt(fee) {
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
    <p style="margin-top:24px;font-size:12px;color:#888;">Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}</p>
    </body></html>
  `;
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(printContent);
    win.document.close();
    win.print();
  }
}
function StudentFees() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: fees, isLoading } = useFeesByStudent((userProfile == null ? void 0 : userProfile.id) ?? "");
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "profile") navigate({ to: "/student/profile" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const totalAmount = (fees ?? []).reduce((s, f) => s + f.amount, 0);
  const totalPaid = (fees ?? []).reduce((s, f) => s + f.paidAmount, 0);
  const outstanding = totalAmount - totalPaid;
  const hasUnpaid = outstanding > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "home", onTabChange: handleTabChange, title: "My Fees", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-4", children: [
    fees && fees.length > 0 && /* Balance summary card */
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `bg-card border rounded-xl p-4 shadow-card role-student ${hasUnpaid ? "border-destructive/30" : "border-border"}`,
        "data-ocid": "fees-summary",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2", children: "Outstanding Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `font-display font-bold text-3xl leading-tight ${hasUnpaid ? "text-destructive" : "text-accent"}`,
              children: formatCurrency(outstanding)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Fees" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mt-0.5", children: formatCurrency(totalAmount) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Paid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-accent mt-0.5", children: formatCurrency(totalPaid) })
            ] })
          ] }),
          totalAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-accent rounded-full transition-smooth",
                style: {
                  width: `${Math.min(100, Math.round(totalPaid / totalAmount * 100))}%`
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right mt-1", children: [
              Math.round(totalPaid / totalAmount * 100),
              "% paid"
            ] })
          ] })
        ]
      }
    ),
    !fees || fees.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: DollarSign,
        title: "No fee records",
        description: "Your fee records will appear here once created by the admin.",
        "data-ocid": "empty-fees"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider px-0.5", children: "Fee Records" }),
      fees.map((fee) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3.5 shadow-card",
          "data-ocid": `fee-row-${fee.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: fee.feeType }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: fee.status })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  fee.month,
                  " ",
                  fee.year,
                  " · Due:",
                  " ",
                  new Date(fee.dueDate).toLocaleDateString("en-IN")
                ] }),
                fee.remarks && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 italic", children: fee.remarks })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: formatCurrency(fee.amount) }),
                fee.paidAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-accent", children: [
                  "Paid: ",
                  formatCurrency(fee.paidAmount)
                ] })
              ] })
            ] }),
            fee.status === "paid" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "w-full h-8 text-xs gap-1.5",
                onClick: () => handlePrintReceipt(fee),
                "data-ocid": `btn-receipt-${fee.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 13 }),
                  " Download Receipt"
                ]
              }
            ) })
          ]
        },
        fee.id
      ))
    ] })
  ] }) });
}
export {
  StudentFees as default
};
