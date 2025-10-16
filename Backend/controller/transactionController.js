
import { transactionModel } from "../model/transactionModel.js";
import { checkLimit } from "../utils/checkLimit.js";

export const createTransaction = async(req, res) => {

    try{
      const { transactionType, amount, category, description, date } = req.body;

      if(!transactionType || !amount || !date){
        return res.status(400).json({message: "transactionType, amount and date is required"});
      }

      if(!["Balance", "Expense"].includes(transactionType)){
        return res.status(400).json({message: "Invalid transactionType"});
      }

      if(transactionType === "Expense"){
        if(!category){
          return res.status(400).json({message: "category is required for Expense"});
        }

        if(!["Grocery", "Restaurant", "Travel", "Shopping", "Bills", "Others"].includes(category)){
          return res.status(400).json({message: "Invalid category"});
        }
      }

      let txnDate = new Date(date);

      if (isNaN(txnDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      // Normalize to UTC midnight → avoids timezone issues
      txnDate.setUTCHours(0, 0, 0, 0);

      const transaction = await transactionModel.create({
        user: req.user._id,
        transactionType,
        amount,
        category,
        description,
        date: txnDate
      });

      if(transactionType == "Expense"){
        try{
          await checkLimit(req.user._id, category);
        }catch(err){
          console.error("Limit check failed", err.message);
        }
      }

      return res.status(201).json({message: "Transaction created successfullly", data: transaction});

    }catch(error){
      return res.status(500).json({message: "Internal Server error"});
    }
}

export const getTransaction = async(req, res) => {

    try{
      // for pagination and filtering
      const { page=1, limit=6, transactionType, category } = req.query;

      // build query
      const query = {user: req.user._id};
      if(category) query.category = category;
      if(transactionType) query.transactionType = transactionType;

      // fetch with pagination and sorting
      const transactions = await transactionModel.find(query)
      .sort({createdAt: -1}) // latest
      .skip((Number(page)-1)*Number(limit)) // skip earlier pages
      .limit(Number(limit));

      // count total for pagination
      const total = await transactionModel.countDocuments(query);

      return res.status(200).json({
        message: "Transactions fetched successfully",
        count: transactions.length, // number of transactions in the current page.
        total: total, // total number of transactions(ignores pagination)
        page: Number(page),
        totalPages: Math.ceil(total/limit),
        data: transactions
      });

    }catch(error){
      return res.status(500).json({message: "Internal Server error"});
    }
}

export const getDashboardData = async (req, res) => {
  try {
    const userObjectId = req.user._id;

    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const startYear = new Date(now.getFullYear(), 0, 1);
    const endYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const [
      totalsAgg,
      totalMonthlyExpenseAgg,
      barChart,
      pieChart,
      recentTransactions
    ] = await Promise.all([

      // totalsAgg: compute total credits and total expenses (all time)
      transactionModel.aggregate([
        { $match: { user: userObjectId } },
        {
          $group: {
            _id: null,
            totalBalanceAdded: {
              $sum: { $cond: [{ $eq: ["$transactionType", "Balance"] }, "$amount", 0] }
            },
            totalExpensesAllTime: {
              $sum: { $cond: [{ $eq: ["$transactionType", "Expense"] }, "$amount", 0] }
            }
          }
        }
      ]),

      // totalMonthlyExpense
      transactionModel.aggregate([
        { $match: { user: userObjectId, transactionType: "Expense", date: { $gte: startMonth, $lte: endMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      // barChart (expenses per month)
      transactionModel.aggregate([
        { $match: { user: userObjectId, transactionType: "Expense", date: { $gte: startYear, $lte: endYear } } },
        { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } },
        {
          $project: {
            _id: 0,
            monthNumber: "$_id",
            total: 1,
            monthName: {
              $arrayElemAt: [
                ["", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                "$_id"
              ]
            }
          }
        },
        { $sort: { monthNumber: 1 } }
      ]),

      // pieChart (category totals this month)
      transactionModel.aggregate([
        { $match: { user: userObjectId, transactionType: "Expense", date: { $gte: startMonth, $lte: endMonth } } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $project: { _id: 0, category: "$_id", total: 1 } }
      ]),

      // recentTransactions
      transactionModel.find({ user: userObjectId }).sort({ createdAt: -1 }).limit(5)
    ]);

    const totalBalanceAdded = totalsAgg[0]?.totalBalanceAdded || 0;
    const totalExpensesAllTime = totalsAgg[0]?.totalExpensesAllTime || 0;
    const totalMonthlyExpense = totalMonthlyExpenseAgg[0]?.total || 0;

    const netBalance = totalBalanceAdded - totalExpensesAllTime;

    return res.status(200).json({
      totalBalance: netBalance,
      totalMonthlyExpense,
      barChart,
      pieChart,
      recentTransactions
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error", error: error.message });
  }
};