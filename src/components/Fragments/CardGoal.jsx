import CircularProgress from "@mui/material/CircularProgress";
import Card from "../Elements/Card.jsx";
import Icon from "../Elements/Icon.jsx";
import { useTheme } from "../../context/themeContext.jsx";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

function CardGoal({ data = {}, isLoading = false }) {
  const { theme } = useTheme();
  const hasGoalData = Object.keys(data).length > 0;

  if (isLoading || !hasGoalData) {
    return (
      <Card title="Goals">
        <div className="flex h-full min-h-64 flex-col items-center justify-center text-primary">
          <CircularProgress color="inherit" size={50} />
          <p className="mt-4 text-sm font-semibold">Loading Data</p>
        </div>
      </Card>
    );
  }

  const targetAmount = Number(data?.target_amount) || 0;
  const presentAmount = Number(data?.present_amount) || 0;
  const remainingAmount = Math.max(targetAmount - presentAmount, 0);
  const chartValue = targetAmount
    ? Math.min((presentAmount / targetAmount) * 100, 100)
    : 0;
  const angle = (chartValue / 100) * Math.PI;
  const radius = 50;
  const centerX = 60;
  const centerY = 60;
  const needleX = centerX + radius * Math.cos(angle - Math.PI);
  const needleY = centerY + radius * Math.sin(angle - Math.PI);
  const largeArcFlag = chartValue > 50 ? 1 : 0;
  const targetLabel = currencyFormatter.format(targetAmount);
  const midLabel = currencyFormatter.format(targetAmount / 2);

  return (
    <Card title="Goals">
      <div className="flex items-center justify-between gap-4">
        <p className="text-3xl font-bold text-slate-900">
          {currencyFormatter.format(remainingAmount)}
        </p>
        <p className="text-sm font-medium text-slate-500">May, 2023</p>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-5">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <Icon.Award className="mt-0.5 text-slate-400" size={22} />
            <div>
              <p className="text-sm text-slate-500">Target Achieved</p>
              <p className="mt-1 font-bold text-slate-900">
                {currencyFormatter.format(presentAmount)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon.Target className="mt-0.5 text-slate-400" size={22} />
            <div>
              <p className="text-sm text-slate-500">This month Target</p>
              <p className="mt-1 font-bold text-slate-900">
                {currencyFormatter.format(targetAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <svg
            viewBox="0 0 120 70"
            className="h-28 w-36"
            aria-hidden="true"
          >
            <path
              d="M10 60 A50 50 0 0 1 110 60"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d={`M10 60 A50 50 0 ${largeArcFlag} 1 ${
                60 + radius * Math.cos(angle - Math.PI)
              } ${
                60 + radius * Math.sin(angle - Math.PI)
              }`}
              fill="none"
              stroke={theme.color}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX}
              y2={needleY}
              stroke={theme.color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx={centerX} cy={centerY} r="4" fill={theme.color} />
          </svg>
          <div className="flex w-full items-center justify-between text-[10px] font-semibold text-slate-500">
            <span>0</span>
            <span>{midLabel}</span>
            <span>{targetLabel}</span>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-slate-500">
        Target vs Achievement
      </p>
    </Card>
  );
}

export default CardGoal;
