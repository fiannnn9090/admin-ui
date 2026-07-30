import CircularProgress from "@mui/material/CircularProgress";
import Card from "../Elements/Card.jsx";
import { AdobeIcon, BillIcon, FigmaIcon } from "../Icons.jsx";
import { fallbackBills } from "../../utils/financialData.js";

function getBillIcon(name) {
  const normalizedName = String(name).toLowerCase();

  if (normalizedName.includes("figma")) {
    return FigmaIcon;
  }

  if (normalizedName.includes("adobe")) {
    return AdobeIcon;
  }

  return BillIcon;
}

function getBillDateParts(date) {
  const parsedDate = new Date(date);

  if (!Number.isNaN(parsedDate.getTime())) {
    return {
      day: String(parsedDate.getDate()).padStart(2, "0"),
      month: parsedDate.toLocaleString("en-US", {
        month: "short",
      }),
    };
  }

  const match = /^(\d{1,2})\s*([A-Za-z]{3,})/.exec(date);

  if (match) {
    return {
      day: match[1].padStart(2, "0"),
      month: match[2].slice(0, 3),
    };
  }

  return { day: date, month: "" };
}

function CardUpcomingBill({ bills = fallbackBills, isLoading = false }) {
  const displayBills = bills.length > 0 ? bills : fallbackBills;

  return (
    <Card link="/bill" title="Upcoming Bill">
      {isLoading ? (
        <div className="flex min-h-52 flex-col items-center justify-center text-primary">
          <CircularProgress color="inherit" size={44} />
          <p className="mt-4 text-sm font-semibold">Loading Bills</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayBills.map((bill) => {
            const BillServiceIcon = getBillIcon(bill.name);
            const { day, month } = getBillDateParts(bill.date);

            return (
              <div
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded border border-slate-100 bg-slate-50 p-4"
                key={bill.id ?? bill.name}
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-900 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {month}
                  </p>
                  <p className="text-xl font-bold leading-none">{day}</p>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded bg-white text-slate-500">
                      <BillServiceIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {bill.name}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-500">
                        Last charge - {bill.date}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="shrink-0 rounded bg-white px-3 py-2 text-sm font-bold text-slate-900">
                  {bill.amount}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default CardUpcomingBill;
