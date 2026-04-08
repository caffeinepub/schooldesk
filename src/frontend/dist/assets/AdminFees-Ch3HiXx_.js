import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, c as cn, L as LoadingSpinner, b as ue } from "./index-BBwbkILB.js";
import { L as Layout, a as Badge } from "./Layout-8MqYqfzj.js";
import { c as createLucideIcon, B as Button } from "./graduation-cap-D7guj77i.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DqYXynMa.js";
import { L as Label, I as Input } from "./label-C0UuxCOR.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { S as StatusBadge } from "./StatusBadge-YQKFDOVw.js";
import { j as useAllFees, k as useMarkFeePaid } from "./useBackend-slhkZeTo.js";
import { D as DollarSign } from "./dollar-sign-CVQveGAv.js";
import { P as Printer } from "./printer-Bc3ktAjY.js";
import "./x-GY-xxyRz.js";
import "./index-B3XdCMvE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode);
const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "paid", label: "Paid" },
  { id: "unpaid", label: "Unpaid" },
  { id: "late", label: "Late" },
  { id: "partial", label: "Partial" }
];
function printReceipt(fee) {
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
    <p style="color:#6b7280;font-size:13px">Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
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
function AdminFees() {
  const navigate = useNavigate();
  const [filter, setFilter] = reactExports.useState("all");
  const [payDialog, setPayDialog] = reactExports.useState(null);
  const [paidAmount, setPaidAmount] = reactExports.useState("");
  const { data: fees = [], isLoading } = useAllFees();
  const markFeePaid = useMarkFeePaid();
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };
  const filtered = reactExports.useMemo(
    () => filter === "all" ? fees : fees.filter((f) => f.status === filter),
    [fees, filter]
  );
  const totalCollected = fees.reduce((s, f) => s + f.paidAmount, 0);
  const totalDue = fees.reduce((s, f) => s + f.amount, 0);
  const collectPct = totalDue > 0 ? Math.round(totalCollected / totalDue * 100) : 0;
  function openPayDialog(f) {
    setPayDialog(f);
    setPaidAmount(String(f.amount - f.paidAmount));
  }
  async function handleMarkPaid() {
    if (!payDialog) return;
    const amount = Number.parseFloat(paidAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      ue.error("Enter a valid amount");
      return;
    }
    try {
      await markFeePaid.mutateAsync({ id: payDialog.id, paidAmount: amount });
      ue.success("Fee marked as paid");
      setPayDialog(null);
    } catch {
      ue.error("Failed to update fee");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { activeTab: "home", onTabChange: handleTabChange, title: "Fees", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl shadow-card p-4 role-admin", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 15, className: "text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground", children: "Collection Summary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Due" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
              "₹",
              totalDue.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Collected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-accent", children: [
              "₹",
              totalCollected.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-accent h-2 rounded-full transition-smooth",
              style: { width: `${Math.min(collectPct, 100)}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
            collectPct,
            "% collected"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-1.5 overflow-x-auto pb-0.5",
          "data-ocid": "fee-filter-tabs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 13, className: "text-muted-foreground flex-shrink-0" }),
            FILTER_TABS.map(({ id, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setFilter(id),
                "data-ocid": `filter-${id}`,
                className: cn(
                  "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  filter === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
                ),
                children: label
              },
              id
            ))
          ]
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { label: "Loading fees…" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: DollarSign,
          title: "No fee records",
          description: "No records match the selected filter.",
          "data-ocid": "empty-fees"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "fees-list", children: filtered.map((fee) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3.5 shadow-card",
          "data-ocid": `fee-row-${fee.id}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: fee.studentName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: fee.status })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: fee.className }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  fee.feeType,
                  " · ",
                  fee.month,
                  " ",
                  fee.year
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
                  "₹",
                  fee.amount.toLocaleString()
                ] }),
                fee.paidAmount > 0 && fee.paidAmount < fee.amount && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-accent", children: [
                  "Paid: ₹",
                  fee.paidAmount.toLocaleString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "Due: ",
                  fee.dueDate
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-shrink-0", children: [
              fee.status !== "paid" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "h-7 text-xs text-accent border-accent/30 hover:bg-accent/10",
                  onClick: () => openPayDialog(fee),
                  "data-ocid": `btn-mark-paid-${fee.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 11, className: "mr-1" }),
                    "Pay"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  className: "h-7 text-xs text-muted-foreground",
                  onClick: () => printReceipt(fee),
                  "aria-label": "Print receipt",
                  "data-ocid": `btn-receipt-${fee.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 11, className: "mr-1" }),
                    "Receipt"
                  ]
                }
              )
            ] })
          ] })
        },
        fee.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!payDialog, onOpenChange: (o) => !o && setPayDialog(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Mark Fee as Paid" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-lg p-3 text-sm space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Student: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: payDialog == null ? void 0 : payDialog.studentName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              "₹",
              payDialog == null ? void 0 : payDialog.amount.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Already Paid: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              "₹",
              payDialog == null ? void 0 : payDialog.paidAmount.toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "paid-amount", className: "text-xs font-medium", children: [
            "Amount Received (₹)",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-0.5", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "paid-amount",
              type: "number",
              min: "1",
              value: paidAmount,
              onChange: (e) => setPaidAmount(e.target.value),
              className: "mt-1",
              "data-ocid": "input-paid-amount"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1",
              onClick: () => setPayDialog(null),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "flex-1",
              onClick: handleMarkPaid,
              disabled: markFeePaid.isPending,
              "data-ocid": "btn-confirm-pay",
              children: markFeePaid.isPending ? "Processing…" : "Confirm Payment"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AdminFees as default
};
