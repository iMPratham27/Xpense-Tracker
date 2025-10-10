import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { EmptyState } from "./EmptyState.jsx";

// Responsive hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

// Custom Tooltip for BarChart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-light border border-border rounded-lg shadow-md px-3 py-2 text-sm animate-fadeIn">
        <p className="font-medium text-text">{label}</p>
        <p className="text-text-muted">
          Expenses:{" "}
          <span className="text-blue-500 font-semibold">
            ₹{payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for PieChart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-bg-light border border-border rounded-lg shadow-md px-3 py-2 text-sm animate-fadeIn">
        <p className="font-medium text-text">{name}</p>
        <p className="text-text-muted">
          Spent: <span className="text-blue-500 font-semibold">₹{value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const DashboardPage = () => {
  const isMobile = useIsMobile();

  // Demo data
  const monthlyData = [
    { month: "Jan", expenses: 800 },
    { month: "Feb", expenses: 1200 },
    { month: "Mar", expenses: 950 },
    { month: "Apr", expenses: 1300 },
    { month: "May", expenses: 700 },
    { month: "Jun", expenses: 1100 },
    { month: "Jul", expenses: 1500 },
    { month: "Aug", expenses: 900 },
    { month: "Sep", expenses: 1250 },
    { month: "Oct", expenses: 1000 },
    { month: "Nov", expenses: 1400 },
    { month: "Dec", expenses: 1700 },
  ];

  const categoryData = [
    { name: "Groceries", value: 400 },
    { name: "Restaurant", value: 300 },
    { name: "Travel", value: 200 },
    { name: "Shopping", value: 250 },
    { name: "Bills", value: 450 },
    { name: "Others", value: 150 },
  ];

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#22c55e",
    "#eab308",
    "#8b5cf6",
    "#64748b",
  ];

  const transactions = [
    {
      id: 1,
      transactionType: "Expense",
      category: "Grocery",
      description: "Weekly groceries",
      date: "Oct 5, 2025",
      amount: 45.99,
    },
    {
      id: 2,
      transactionType: "Expense",
      category: "Restaurant",
      description: "Dinner with friends",
      date: "Oct 8, 2025",
      amount: 65.5,
    },
    {
      id: 3,
      transactionType: "Expense",
      category: "Travel",
      description: "Taxi fare",
      date: "Oct 12, 2025",
      amount: 120.0,
    },
    {
      id: 4,
      transactionType: "Expense",
      category: "Shopping",
      description: "New shoes",
      date: "Oct 14, 2025",
      amount: 80.75,
    },
    {
      id: 5,
      transactionType: "Balance",
      description: "Salary credited",
      date: "Oct 1, 2025",
      amount: 2000.0,
    },
  ];

  // Icons for categories
  const categoryIcons = {
    Grocery: "🛒",
    Restaurant: "🍽️",
    Travel: "🚕",
    Shopping: "🛍️",
    Bills: "💡",
    Others: "📦",
  };

  // Icon for Balance
  const balanceIcon = "💰";

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-bg min-h-screen font-sans">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5 animate-fadeIn">
        {/* Greeting */}
        <div className="md:col-span-3 bg-bg-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h1 className="text-2xl font-bold text-text">Welcome back, Prathamesh 👋</h1>
          <p className="text-text-muted text-sm mt-1">Here’s your October,2025 summary</p>
        </div>

        {/* Balance + Expenses side by side */}
        <div className="md:col-span-3 flex gap-4 items-stretch">
          {/* Balance */}
          <div className="flex-1 bg-bg-light rounded-2xl p-6 shadow-sm flex flex-col hover:scale-[1.02] transition-transform">
            <p className="text-text-muted text-sm">Total Balance</p>
            <p className=" text-xl md:text-3xl font-semibold text-text mt-2 break-words">₹2,45,000</p>
          </div>

          {/* Expenses */}
          <div className="flex-1 bg-bg-light rounded-2xl p-6 shadow-sm flex flex-col hover:scale-[1.02] transition-transform">
            <p className="text-text-muted text-sm">This Month</p>
            <p className="text-xl md:text-3xl font-semibold text-red-500 mt-2 break-words">₹32,500</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="md:col-span-6 bg-bg-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow min-h-[350px] flex flex-col">
          <h2 className="text-lg font-semibold text-text mb-4">Monthly Expenses</h2>
          {monthlyData && monthlyData.length > 0 ? (
            <div className="overflow-x-auto touch-pan-x pointer-events-auto">
              <div className="min-w-[600px]">
                <ResponsiveContainer width="100%" height={isMobile ? 360 : 250}>
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="month"
                      stroke="var(--color-text-muted)"
                      interval={0}
                    />
                    <YAxis stroke="var(--color-text-muted)" />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                      content={<CustomBarTooltip />}
                    />
                    <Bar
                      dataKey="expenses"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={isMobile ? 20 : 40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <EmptyState type="bar" message="No expenses data yet" />
          )}
        </div>

        {/* Pie Chart */}
        <div className="md:col-span-2 bg-bg-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow min-h-[350px] flex flex-col">
          <h2 className="text-lg font-semibold text-text mb-4">By Category</h2>
          {categoryData && categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={isMobile ? 320 : 250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={isMobile ? 30 : 50}
                  outerRadius={isMobile ? 90 : 100}
                  paddingAngle={4}
                  isAnimationActive={false}
                  onClick={(entry, index) =>
                    console.log("Slice clicked:", entry)
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  content={<CustomPieTooltip />}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState type="pie" message="No category data yet" />
          )}
        </div>

        {/* Recent Transactions */}
        <div
          className="md:col-span-4 bg-bg-light rounded-2xl p-6 shadow-sm hover:shadow-md 
              transition-shadow duration-300 min-h-[350px] md:min-h-[420px] flex flex-col"
        >
          <h2 className="text-lg font-semibold text-text mb-4">Recent Transactions</h2>

          {transactions && transactions.length > 0 ? (
            <ul className="flex-1 grid grid-rows-5 divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => {
                const t = transactions[i];
                if (!t) {
                  // Empty placeholder row to keep spacing consistent
                  return <li key={`empty-${i}`} className="py-2"></li>;
                }

                return (
                  <li
                    key={t.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-bg-dark/20 rounded-lg transition-colors"
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-dark/40 mr-2">
                      <span className="text-lg">
                        {t.transactionType === "Balance"
                          ? balanceIcon
                          : categoryIcons[t.category] || "❓"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center md:gap-4">
                      <p className="text-base font-medium text-text w-28">
                        {t.transactionType === "Balance"
                          ? "Balance"
                          : t.category}
                      </p>
                      <p className="text-sm text-text-muted md:w-28">{t.date}</p>
                      <p className="text-sm text-text-muted truncate flex-1">{t.description}</p>
                    </div>

                    {/* Amount */}
                    <p
                      className={`font-semibold text-base text-right w-20 ${
                        t.transactionType === "Expense"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      ₹{t.amount}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState type="transactions" message="No transactions yet" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
