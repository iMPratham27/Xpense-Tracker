import { useState } from "react";
import { EmptyState } from "./EmptyState.jsx";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createTransaction } from "../utils/apiHelper.js";

export const ExpensesPage = () => {
  
  // FORM RELATED THINGS

  const { register, handleSubmit, watch, reset, formState: {errors, isSubmitting} } = useForm({
    defaultValues: {
      transactionType: "Expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
    }
  });

  const categories = ["Grocery", "Restaurant", "Travel", "Shopping", "Bills", "Others"];

  /*
    'watch' lets you observe the value of one or more form fields in real time.
    use when, you want to conditionaly show/hide fields
  */
  const transactionType = watch("transactionType");

  const onSubmit = async(data) => {
    try{
      const payload = {
        ...data, 
        amount: Number(data.amount), 
        date: new Date(data.date).toISOString()
      }

      if (payload.transactionType === "Balance") {
        delete payload.category;
      }

      await createTransaction(payload); // api call

      toast.success("Transaction add successfully ✅");

      reset();

    }catch(err){
      console.error(err);
      toast.error("Failed to add transaction ❌");
    }
  }

  // TRANSACTIONS RELATED THINGS

  const demoTransactions = [
    { _id: 1, transactionType: "Balance", amount: 2000, date: "2025-10-01", description: "Salary credited" },
    { _id: 2, transactionType: "Expense", category: "Grocery", amount: 45.99, date: "2025-10-05", description: "Weekly groceries" },
    { _id: 3, transactionType: "Expense", category: "Restaurant", amount: 65.5, date: "2025-10-08", description: "Dinner with friends" },
    { _id: 4, transactionType: "Expense", category: "Travel", amount: 120, date: "2025-10-12", description: "Taxi fare" },
    { _id: 5, transactionType: "Expense", category: "Shopping", amount: 80.75, date: "2025-10-14", description: "New shoes" },
    { _id: 6, transactionType: "Expense", category: "Shopping", amount: 80.75, date: "2025-10-14", description: "New shoes" },
  ];

  const categoryIcons = {
    Grocery: "🛒",
    Restaurant: "🍽️",
    Travel: "🚕",
    Shopping: "🛍️",
    Bills: "💡",
    Others: "📦",
    Balance: "💰",
  };

  const [page, setPage] = useState(1);
  const perPage = 6;
  const totalPages = Math.ceil(demoTransactions.length / perPage);

  const [filters, setFilters] = useState({ transactionType: "", category: "" });

  // Filtering
  const filtered = demoTransactions.filter((t) => {
    if (filters.transactionType && t.transactionType !== filters.transactionType) return false;
    if (filters.category && t.category !== filters.category) return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-bg min-h-screen font-sans animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* =====================
            FORM SECTION
        ====================== */}
        <div className="bg-bg-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col min-h-[500px]">
          <h2 className="text-lg font-semibold text-text mb-4">Add Transaction</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm text-text-muted mb-1">Transaction Type</label>
              <select
                {...register("transactionType", {required: "Transaction type is required"})}
                className="w-full rounded-xl border border-border px-3 py-2 bg-bg-light text-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Expense">Expense</option>
                <option value="Balance">Balance</option>
              </select>
              {errors.transactionType && (
                <p className="text-red-500 text-xs mt-1">{errors.transactionType.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm text-text-muted mb-1">Amount</label>
              <input
                type="number"
                {...register("amount", {
                  required: "Amount is required", 
                  min: {value : 1, message: "Must be greater than 0"}
                })}
                className="w-full rounded-xl border border-border px-3 py-2 bg-bg-light text-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Category */}
            {transactionType === "Expense" && (
              <div>
                <label className="block text-sm text-text-muted mb-1">Category</label>
                <select
                  {...register("category", {required: "Category is required"})}
                  className="w-full rounded-xl border border-border px-3 py-2 bg-bg-light text-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm text-text-muted mb-1">Description</label>
              <input
                type="text"
                {...register("description")}
                className="w-full rounded-xl border border-border px-3 py-2 bg-bg-light text-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm text-text-muted mb-1">Date</label>
              <input
                type="date"
                {...register("date", {required: "Date is required"})}
                className="w-full rounded-xl border border-border px-3 py-2 bg-bg-light text-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p Name="text-red-500 text-xs mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Submit */}
            {/*
              When user clicks → button is disabled, text changes to Adding....
              When API finishes → button is re-enabled, text goes back to Add Transaction.
            */}
            <button
              type="submit"
              disabled = {isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </button>
          </form>
        </div>

        {/* =====================
            TRANSACTIONS SECTION
        ====================== */}
        <div className="bg-bg-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col min-h-[500px]">
          <h2 className="text-lg font-semibold text-text mb-4">All Transactions</h2>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <select
              value={filters.transactionType}
              onChange={(e) => setFilters((prev) => ({ ...prev, transactionType: e.target.value }))}
              className="rounded-xl border border-border px-3 py-2 bg-bg-light text-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Expense">Expense</option>
              <option value="Balance">Balance</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="rounded-xl border border-border px-3 py-2 bg-bg-light text-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Transactions */}
          <div className="flex-1">
            {paginated.length > 0 ? (
              <ul className="grid grid-rows-6 divide-y divide-border">
                {Array.from({ length: perPage }).map((_, i) => {
                  const t = paginated[i];
                  if (!t) return <li key={`empty-${i}`} className="py-3"></li>;
                  return (
                    <li
                      key={t._id}
                      className="flex items-center justify-between px-3 py-3 hover:bg-bg-dark/20 rounded-lg transition-colors"
                    >
                      {/* Icon */}
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-dark/40 mr-3">
                        <span>{categoryIcons[t.transactionType === "Balance" ? "Balance" : t.category]}</span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col md:flex-row md:items-center md:gap-4">
                        <p className="text-sm font-medium text-text w-28">
                          {t.transactionType === "Balance" ? "Balance" : t.category}
                        </p>
                        <p className="text-xs text-text-muted md:w-28">
                          {new Date(t.date).toDateString()}
                        </p>
                        <p className="text-xs text-text-muted truncate flex-1">{t.description}</p>
                      </div>

                      {/* Amount */}
                      <p
                        className={`font-semibold text-base text-right w-20 ${
                          t.transactionType === "Expense" ? "text-red-500" : "text-green-500"
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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-1.5 rounded-full border border-border text-sm font-medium 
               text-text hover:bg-bg-dark/30 transition-colors 
               disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-sm text-text-muted">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-1.5 rounded-full border border-border text-sm font-medium 
               text-text hover:bg-bg-dark/30 transition-colors 
               disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
