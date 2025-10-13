import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getTransaction, createTransaction as createTxnApi, getDashboardData } from "../utils/apiHelper.js";

const TransactionsContext = createContext(null);
export const useTransactions = () => useContext(TransactionsContext);

export const TransactionProvider = ({ children }) => {

    // expenses state
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0); // how many transactions in total
    const [limit] = useState(6);
    const [filters, setFilters] = useState({ transactionType: "", category: "" });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // dashboard state
    const [dashboard, setDashboard] = useState({
        totalBalance: 0,
        totalMonthlyExpense: 0,
        barChart: [], // [{ monthNumber, total, monthName }]
        pieChart: [], // [{ category, total }]
        recentTransactions: []
    });

    const [dashboardLoading, setDashboardLoading] = useState(false);

    /*
        If user clicks between filters/pages very fast, multiple API calls might overlap. 
        Using abortRef, we can cancel the old request before starting a new one. 
        That way only the latest request counts.
    */
    const abortRef = useRef(null);
    const abortDashboardRef = useRef(null);

    // Actions
    const fetchTransactions =  async (opts) => {
        const _page = opts?.page ?? page;
        const _filters = opts?.filters ?? filters;

        try{
            setLoading(true);
            setError("");

            if(abortRef.current) abortRef.current.abort();
            abortRef.current = new AbortController();

            const params = {page: _page, limit};

            // add filters to params if present
            if(_filters.transactionType) params.transactionType = _filters.transactionType;
            if(_filters.category) params.category = _filters.category;

            const { data } = await getTransaction(params, {signal: abortRef.current.signal})

            // update state
            setTransactions(data.data || []);
            setPage(data.page || 1);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || 0);

        }catch(err){
            if(err?.name === "CanceledError" || err?.message === "canceled") return;
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const fetchDashboardData = async() => {
        try{
           setDashboardLoading(true);
           
           if(abortDashboardRef.current) abortDashboardRef.current.abort();
           abortDashboardRef.current = new AbortController();

           const { data } = await getDashboardData({signal: abortDashboardRef.current.signal});

           // update state
           setDashboard({
            totalBalance: data.totalBalance ?? 0,
            totalMonthlyExpense: data.totalMonthlyExpense ?? 0,
            barChart: data.barChart ?? [],
            pieChart: data.pieChart ?? [],
            recentTransactions: data.recentTransactions ?? []
           });

        }catch(err){
            if(err?.name === "CanceledError" || err?.message === "canceled") return;
            console.error(err);
        }finally{
            setDashboardLoading(false);
        }
    }

    const createTransaction = async(payload) => {
        try{
            const clean = {...payload};

            // remove category if transactionType is Balance
            if(clean.transactionType === "Balance") delete clean.category;

            await createTxnApi(clean);

            // refresh both transaction list and dashboard so ui stays consistent
            await fetchTransactions({page:1 , filters});
            await fetchDashboardData();

        }catch(err){
            console.error(err);
        }
    }

    const updateFilters = (updater) => {
        setFilters((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            // after state commits, trigger fetch
            // we return next, then in effect below we watch filters/page
            if (page !== 1) setPage(1);
            // If page is already 1, effect will still catch filters change
            return next;
        });
    }

    // keep data in sync : whenever page or filter changes
    useEffect(() => {
        fetchTransactions({ page, filters });

        // cleanup
        return () => {
            if(abortRef.current) abortRef.current.abort();
        }
    }, [page, filters]);

    useEffect(()=> {
        fetchDashboardData();

        return () => {
            if(abortDashboardRef.current) abortDashboardRef.current.abort();
        }
    },[])

    const value = useMemo(() => ({
        transactions, page, totalPages, total, limit, filters, loading, error,
        setPage, updateFilters, fetchTransactions, createTransaction,
        dashboard, dashboardLoading, fetchDashboardData
    }), [
        transactions, page, totalPages, total, limit, filters, loading, error, 
        dashboard, dashboardLoading
    ]);


    return (<TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>);
}


/*

Example : 
Say you click page 1 → request A goes out.
Immediately click page 2 → request B goes out.

Without signal:
A and B both run.
If A finishes last, it overwrites B in your state → wrong data shown.

With signal:
When B starts, we call 'abortRef.current.abort()' → A is canceled.
Only B runs and updates state.
✅ UI always shows the latest.

*/