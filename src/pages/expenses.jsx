import CircularProgress from "@mui/material/CircularProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useMemo, useState } from "react";
import AppSnackbar from "../components/Elements/AppSnackbar.jsx";
import MainLayout from "../components/Layouts/MainLayout.jsx";
import {
  CarIcon,
  ExpenseIcon,
  HouseIcon,
  ShoppingBagIcon,
  UtensilsIcon,
  WalletIcon,
} from "../components/Icons.jsx";
import { useAuth } from "../context/authContext.jsx";
import { expensesService } from "../services/dataService.jsx";
import {
  fallbackExpenseCategories,
  normalizeExpenseCategories,
} from "../utils/financialData.js";

const categoryIcons = {
  entertainment: ExpenseIcon,
  food: UtensilsIcon,
  housing: HouseIcon,
  others: WalletIcon,
  shopping: ShoppingBagIcon,
  transportation: CarIcon,
};

function getCategoryIcon(name) {
  const normalizedName = String(name ?? "").trim().toLowerCase();
  return categoryIcons[normalizedName] ?? WalletIcon;
}

function Expenses() {
  const { user } = useAuth();
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    message: "",
    open: false,
    severity: "error",
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchExpenses() {
      if (user?.source === "local") {
        setExpenseCategories(fallbackExpenseCategories);
        setIsLoading(false);
        return;
      }

      try {
        const data = await expensesService();
        const normalizedExpenses = normalizeExpenseCategories(data);

        if (!isMounted) {
          return;
        }

        setExpenseCategories(
          normalizedExpenses.length > 0
            ? normalizedExpenses
            : fallbackExpenseCategories,
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSnackbar({
          message: error?.msg || "Gagal mengambil data expenses",
          open: true,
          severity: "error",
        });
        setExpenseCategories(fallbackExpenseCategories);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchExpenses();

    return () => {
      isMounted = false;
    };
  }, [user?.source]);

  const totalCategories = useMemo(
    () => expenseCategories.length,
    [expenseCategories],
  );

  return (
    <MainLayout>
      <section>
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Expenses Comparison
          </h1>
          <p className="text-sm text-slate-500">
            {isLoading
              ? "Loading comparison data"
              : `${totalCategories} categories tracked this month`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-96 flex-col items-center justify-center rounded bg-white text-primary shadow-sm">
            <CircularProgress color="inherit" size={52} />
            <p className="mt-4 text-sm font-semibold">Loading Expenses</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {expenseCategories.map((category) => {
              const CategoryIcon = getCategoryIcon(category.name);
              const isUp = String(category.trend).toLowerCase() !== "down";

              return (
                <article
                  className="rounded bg-white p-5 shadow-sm"
                  key={category.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded bg-slate-50 text-slate-500">
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-900">
                          {category.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Total Expense
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-0.5 text-sm font-semibold ${
                        isUp ? "text-red-500" : "text-emerald-600"
                      }`}
                    >
                      {isUp ? (
                        <KeyboardArrowUpIcon fontSize="small" />
                      ) : (
                        <KeyboardArrowDownIcon fontSize="small" />
                      )}
                      {category.percentage}
                    </div>
                  </div>

                  <p className="mt-5 text-2xl font-bold text-slate-900">
                    {category.amount}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-normal text-slate-500">
                      Expense Items
                    </p>
                    <ul className="space-y-2">
                      {category.items.length > 0 ? (
                        category.items.map((item) => (
                          <li
                            className="flex items-center justify-between gap-3 rounded bg-slate-50 px-3 py-2 text-sm text-slate-600"
                            key={item}
                          >
                            <span className="truncate">{item}</span>
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          </li>
                        ))
                      ) : (
                        <li className="rounded bg-slate-50 px-3 py-2 text-sm text-slate-500">
                          No expense items
                        </li>
                      )}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <AppSnackbar
          message={snackbar.message}
          onClose={() =>
            setSnackbar((current) => ({ ...current, open: false }))
          }
          open={snackbar.open}
          severity={snackbar.severity}
        />
      </section>
    </MainLayout>
  );
}

export default Expenses;
