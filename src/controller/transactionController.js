
import { transactionModel } from "../model/transactionModel.js";

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

        const transaction = await transactionModel.create({
            // user: req.user._id,
            user: "68dee6667932bad669e88d22", // just for testing
            transactionType,
            amount,
            category,
            description,
            date
        });

        return res.status(201).json({message: "Transaction created successfullly", data: transaction});

    }catch(error){
        return res.status(500).json({message: "Internal Server error"});
    }
}

export const getTransaction = async(req, res) => {

    try{
        // for pagination and filtering
        const { page=1, limit=10, transactionType, category } = req.query;

        // build query
        //const query = {user: req.user._id};
        const query = {user: "68dee6667932bad669e88d22"}; // just for testing
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