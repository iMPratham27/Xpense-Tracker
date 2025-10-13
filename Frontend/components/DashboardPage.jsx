import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { EmptyState } from "./EmptyState.jsx";
import { useTransactions } from "../context/TransactionContext.jsx";
import { getCurrUser } from "../utils/apiHelper.js";

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

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async() => {
      try{
        const { data } = await getCurrUser();
        setUser(data);
      }catch(err){
        console.log(err);
      }
    }

    fetchUser();
  },[]);

  const firstName = user?.name?.split(" ")[0];

  const COLORS = [ "#3b82f6", "#ef4444", "#22c55e", "#eab308", "#8b5cf6", "#64748b" ];

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

  const { dashboard, dashboardLoading } = useTransactions();

  // bar chart data
  const monthlyData = useMemo(() => {

    if(!dashboard?.barChart) return [];

    return (dashboard.barChart || []).map(b => ({
      month: b.monthName || (["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Number(b.monthNumber)]),
      expenses: Number(b.total) || 0
    }));
  }, [dashboard]);


  // pie chart data
  const categoryData = useMemo(() => {
    return (dashboard?.pieChart || []).map((p) => ({
      name: p.category, 
      value: Number(p.total)
    }))
  }, [dashboard])

  // recent transaction
  const recentTransactions = dashboard?.recentTransactions || [];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-bg min-h-screen font-sans">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5 animate-fadeIn">
        {/* Greeting */}
        <div className="md:col-span-3 bg-bg-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h1 className="text-2xl font-bold text-text">Welcome back{firstName ? `, ${firstName}` : ""} 👋</h1>
          <p className="text-text-muted text-sm mt-1">
            Here’s your {new Date().toLocaleString('default', {month: 'long'})}, {new Date().getFullYear()} summary 
          </p>
        </div>

        {/* Balance + Expenses side by side */}
        <div className="md:col-span-3 flex gap-4 items-stretch">
          {/* Balance */}
          <div className="flex-1 bg-bg-light rounded-2xl p-6 shadow-sm flex flex-col 
                          hover:scale-[1.02] transition-transform">
            <p className="text-text-muted text-sm">Total Balance</p>
            <p
              className={`text-xl md:text-3xl font-semibold mt-2 break-words ${
                dashboard?.totalBalance < 0 ? "text-red-500" : "text-text"
              }`}
            >
              {dashboard?.totalBalance < 0
                ? `-₹${Math.abs(dashboard.totalBalance).toLocaleString()}`
                : `₹${dashboard?.totalBalance?.toLocaleString()}`}
            </p>
          </div>


          {/* Expenses */}
          <div className="flex-1 bg-bg-light rounded-2xl p-6 shadow-sm flex flex-col hover:scale-[1.02] transition-transform">
            <p className="text-text-muted text-sm">This Month</p>
            <p className="text-xl md:text-3xl font-semibold text-red-500 mt-2 break-words">
              ₹{dashboard?.totalMonthlyExpense?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="md:col-span-6 bg-bg-light rounded-2xl p-6 shadow-sm 
                        hover:shadow-md transition-shadow min-h-[350px] flex flex-col">
          <h2 className="text-lg font-semibold text-text mb-4">Monthly Expenses</h2>
          
          {monthlyData && monthlyData.length > 0 ? (
            <div className="overflow-x-auto touch-pan-x pointer-events-auto">
              <div className="min-w-[600px]">
                <ResponsiveContainer width="100%" height={isMobile ? 360 : 250}>
                  <BarChart
                    key={monthlyData.length}
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
                      wrapperStyle={{ pointerEvents: "auto" }}
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
        <div className="md:col-span-2 bg-bg-light rounded-2xl p-6 shadow-sm 
                        hover:shadow-md transition-shadow min-h-[350px] flex flex-col">
          <h2 className="text-lg font-semibold text-text mb-4">By Category</h2>
          
          {categoryData && categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={isMobile ? 320 : 250}>
              <PieChart key={categoryData.length} >
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={isMobile ? 30 : 50}
                  outerRadius={isMobile ? 90 : 100}
                  paddingAngle={4}
                  isAnimationActive={false}
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
                  wrapperStyle={{ pointerEvents: "auto" }}
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

          {recentTransactions && recentTransactions.length > 0 ? (
            <ul className="flex-1 grid grid-rows-5 divide-y divide-border">
              
              {Array.from({ length: 5 }).map((_, i) => {
                const t = recentTransactions[i];
                if (!t) {
                  // Empty placeholder row to keep spacing consistent
                  return <li key={`empty-${i}`} className="py-2"></li>;
                }

                const isExpense = t.transactionType === "Expense";
                const icon = t.transactionType === "Balance" ? balanceIcon : (categoryIcons[t.category] || "❓");
                const displayDate = new Date(t.date).toLocaleDateString();

                return (
                  <li
                    key={t._id || t.id || i}
                    className="flex items-center justify-between px-3 py-2 hover:bg-bg-dark/20 rounded-lg transition-colors"
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-dark/40 mr-2">
                      <span className="text-lg">
                        {icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center md:gap-4">
                      <p className="text-base font-medium text-text w-28">
                        {t.transactionType === "Balance" ? "Balance" : t.category}
                      </p>
                      
                      <p className="text-sm text-text-muted md:w-28">{displayDate}</p>
                      
                      <p className="text-sm text-text-muted truncate flex-1">{t.description}</p>
                    </div>

                    {/* Amount */}
                    <p
                      className={`font-semibold text-base text-right w-20 
                        ${isExpense ? "text-red-500" : "text-green-500"}  
                      `}
                    >
                      ₹{Number(t.amount).toLocaleString()}
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
