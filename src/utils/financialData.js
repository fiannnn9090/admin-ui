export const fallbackBills = [
  {
    amount: "$150",
    date: "14 May, 2023",
    id: "figma-monthly",
    name: "Figma - Monthly",
  },
  {
    amount: "$559",
    date: "17 Jun, 2023",
    id: "adobe-yearly",
    name: "Adobe - Yearly",
  },
];

export const fallbackExpenseCategories = [
  {
    amount: "$250.00",
    id: "housing",
    items: ["House rent", "Electricity", "Maintenance"],
    name: "Housing",
    percentage: "15%",
    trend: "up",
  },
  {
    amount: "$350.00",
    id: "food",
    items: ["Groceries", "Restaurant", "Coffee"],
    name: "Food",
    percentage: "8%",
    trend: "down",
  },
  {
    amount: "$50.00",
    id: "transportation",
    items: ["Taxi fare", "Fuel", "Parking"],
    name: "Transportation",
    percentage: "12%",
    trend: "down",
  },
  {
    amount: "$80.00",
    id: "entertainment",
    items: ["Movie", "Game", "Streaming"],
    name: "Entertainment",
    percentage: "5%",
    trend: "up",
  },
  {
    amount: "$420.00",
    id: "shopping",
    items: ["Clothes", "Accessories", "Gadget"],
    name: "Shopping",
    percentage: "18%",
    trend: "up",
  },
  {
    amount: "$650.00",
    id: "others",
    items: ["Donation", "Subscription", "Miscellaneous"],
    name: "Others",
    percentage: "10%",
    trend: "down",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 2,
  style: "currency",
});

function ensureArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (value && typeof value === "object") {
    return Object.values(value);
  }

  return [];
}

export function formatMoney(value) {
  if (typeof value === "string") {
    return value;
  }

  const numericValue = Number(value);
  return currencyFormatter.format(Number.isFinite(numericValue) ? numericValue : 0);
}

function normalizePercent(value, fallback = "0%") {
  if (typeof value === "string") {
    return value.includes("%") ? value : `${value}%`;
  }

  if (typeof value === "number") {
    return `${value}%`;
  }

  return fallback;
}

export function normalizeBills(payload) {
  const items = ensureArray(payload);

  if (items.length === 0) {
    return [];
  }

  return items.map((bill, index) => ({
    amount: formatMoney(bill.amount ?? bill.total ?? bill.price ?? bill.value),
    date:
      bill.date ??
      bill.due_date ??
      bill.last_charge ??
      bill.created_at ??
      "No due date",
    id: bill.id ?? bill._id ?? `${bill.name ?? "bill"}-${index}`,
    name:
      bill.name ??
      bill.title ??
      bill.bill_name ??
      bill.merchant ??
      `Bill ${index + 1}`,
  }));
}

export function normalizeExpenseCategories(payload) {
  const categories = ensureArray(payload);

  if (categories.length === 0) {
    return [];
  }

  return categories.map((category, index) => {
    const items = ensureArray(
      category.items ??
        category.expenses ??
        category.transactions ??
        category.detail ??
        [],
    );

    return {
      amount: formatMoney(
        category.amount ??
          category.total ??
          category.total_expense ??
          category.value,
      ),
      id: category.id ?? category._id ?? `${category.name ?? "expense"}-${index}`,
      items: items.map((item, itemIndex) => {
        if (typeof item === "string") {
          return item;
        }

        return (
          item.name ??
          item.title ??
          item.description ??
          item.category ??
          `Expense item ${itemIndex + 1}`
        );
      }),
      name:
        category.name ??
        category.category ??
        category.type ??
        `Category ${index + 1}`,
      percentage: normalizePercent(
        category.percentage ?? category.percent ?? category.comparison,
        "0%",
      ),
      trend:
        category.trend ??
        category.status ??
        (Number(category.percentage ?? 0) >= 0 ? "up" : "down"),
    };
  });
}
