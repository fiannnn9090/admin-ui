import { useEffect, useState } from "react";
import AppSnackbar from "../components/Elements/AppSnackbar.jsx";
import CardBalance from "../components/Fragments/CardBalance.jsx";
import CardExpenseBreakdown from "../components/Fragments/CardExpenseBreakdown.jsx";
import CardGoal from "../components/Fragments/CardGoal.jsx";
import CardRecentTransaction from "../components/Fragments/CardRecentTransaction.jsx";
import CardStatistic from "../components/Fragments/CardStatistic.jsx";
import CardUpcomingBill from "../components/Fragments/CardUpcomingBill.jsx";
import MainLayout from "../components/Layouts/MainLayout.jsx";
import { useAuth } from "../context/authContext.jsx";
import { billsService, goalService } from "../services/dataService.jsx";
import { useNavigate } from "react-router-dom";
import {
  fallbackBills,
  normalizeBills,
} from "../utils/financialData.js";

function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState({});
  const [isGoalsLoading, setIsGoalsLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [isBillsLoading, setIsBillsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    message: "",
    open: false,
    severity: "error",
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchGoals() {
      if (user?.source === "local") {
        setGoals({
          present_amount: 7500,
          target_amount: 15000,
        });
        setBills(fallbackBills);
        setIsGoalsLoading(false);
        setIsBillsLoading(false);
        return;
      }

      try {
        const [goalData, billData] = await Promise.all([
          goalService(),
          billsService(),
        ]);

        if (!isMounted) {
          return;
        }

        setGoals(
          Object.keys(goalData).length > 0
            ? goalData
            : { present_amount: 0, target_amount: 0 },
        );
        setBills(normalizeBills(billData));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSnackbar({
          message: error?.msg || "Gagal mengambil data goals",
          open: true,
          severity: "error",
        });
        setGoals({ present_amount: 0, target_amount: 0 });
        setBills(fallbackBills);

        if (error?.status === 401 && user?.source !== "local") {
          logout();
          navigate("/login", { replace: true });
        }
      } finally {
        if (isMounted) {
          setIsGoalsLoading(false);
          setIsBillsLoading(false);
        }
      }
    }

    fetchGoals();

    return () => {
      isMounted = false;
    };
  }, [logout, navigate, user?.source]);

  return (
    <MainLayout>
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <CardBalance />
        </div>
        <div className="xl:col-span-4">
          <CardGoal data={goals} isLoading={isGoalsLoading} />
        </div>
        <div className="xl:col-span-4">
          <CardUpcomingBill bills={bills} isLoading={isBillsLoading} />
        </div>
        <div className="xl:col-span-4 xl:row-span-2">
          <CardRecentTransaction />
        </div>
        <div className="xl:col-span-8">
          <CardStatistic />
        </div>
        <div className="xl:col-span-8">
          <CardExpenseBreakdown />
        </div>
      </div>

      <AppSnackbar
        message={snackbar.message}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        open={snackbar.open}
        severity={snackbar.severity}
      />
    </MainLayout>
  );
}

export default Dashboard;
