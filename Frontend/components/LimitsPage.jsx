import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FadeLoader } from "react-spinners";
import { useState, useEffect } from "react";
import { createLimit, getLimits } from "../utils/apiHelper.js";

export const LimitsPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { category: "", limitAmount: "" },
  });

  const [limits, setLimits] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = ["Grocery", "Restaurant", "Travel", "Shopping"];

  // Fetch all limits
  const fetchLimits = async () => {
    try {
      setLoading(true);
      const { data } = await getLimits();
      setLimits(data.results || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load limits ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  // Submit form
  const onSubmit = async (data) => {
    try {
      await createLimit({
        category: data.category,
        limitAmount: Number(data.limitAmount),
      });
      toast.success("Limit added successfully ✅");
      reset();
      fetchLimits();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add limit ❌";
      toast.error(msg);
    }
  };

  // Helpers
  const formatCurrency = (amount) => `₹${amount?.toLocaleString()}`;
  const getProgressColor = (percent) => {
    if (percent >= 100) return "bg-red-500";
    if (percent >= 90) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-bg min-h-screen font-sans animate-fadeIn">
      
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* =====================
            ADD LIMIT FORM
        ====================== */}
        <section className="bg-bg-light rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[520px]">
          <h2 className="text-xl font-semibold text-text mb-6">
            Set Monthly Spending Limit
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex-1">
            {/* Category */}
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full rounded-xl border border-border px-3 py-2 bg-bg-light text-text 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Limit Amount */}
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Limit Amount (₹)
              </label>
              <input
                type="number"
                {...register("limitAmount", {
                  required: "Limit amount is required",
                  min: { value: 1, message: "Must be greater than 0" },
                })}
                className="w-full rounded-xl border border-border px-3 py-2 bg-bg-light text-text 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.limitAmount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.limitAmount.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-1
                rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : "Add Limit"}
            </button>
          </form>

          <p className="text-xs text-text-muted mt-6 leading-relaxed">
            • You can’t set a new limit for a category until the previous one is completed.<br/>
            • You can’t set a limit on the last day of the month.<br/>
            • Email alerts are sent automatically at 90% and 100%.
          </p>
        </section>

        {/* =====================
            LIMITS LIST
        ====================== */}
        <section className="bg-bg-light rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[520px]">
          <h2 className="text-xl font-semibold text-text mb-6">
            Current Month’s Limits
          </h2>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <FadeLoader color="hsl(145, 70%, 45%)" />
            </div>
          ) : limits.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center text-text-muted">
              <span className="text-5xl mb-3">💡</span>
              <p>No limits set for this month</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-5 flex-1 overflow-y-auto">
              {limits.map((limit) => (
                <li
                  key={limit._id}
                  className="p-5 md:p-6 rounded-2xl bg-bg-dark/40 backdrop-blur-sm transition-transform hover:scale-[1.01]"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-text">
                        {limit.category}
                      </span>
                      <span className="text-[0.75rem] text-text-muted mt-0.5">
                        {new Date(limit.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-semibold tracking-wide px-3 py-1 rounded-full ${
                        limit.status === "completed"
                          ? "bg-red-200 text-red-700 dark:bg-red-600/20 dark:text-red-300"
                          : "bg-green-200 text-green-700 dark:bg-green-600/20 dark:text-green-300"
                      }`}
                    >
                      {limit.status === "completed" ? "COMPLETED" : "ACTIVE"}
                    </span>
                  </div>


                  {/* Progress Bar */}
                  <div className="h-3 bg-border rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${getProgressColor(
                        limit.percent
                      )} transition-all`}
                      style={{ width: `${Math.min(100, limit.percent)}%` }}
                    ></div>
                  </div>

                  {/* Details */}
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>
                      Spent:{" "}
                      <span className="text-text font-medium">
                        {formatCurrency(limit.spent)}
                      </span>
                    </span>
                    <span>
                      Limit:{" "}
                      <span className="text-text font-medium">
                        {formatCurrency(limit.limitAmount)}
                      </span>
                    </span>
                    <span>{Math.round(limit.percent)}%</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
