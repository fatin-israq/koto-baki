import { useState, useMemo, useCallback } from 'react';
import { INITIAL_SHOP_INFO, INITIAL_CUSTOMERS, INITIAL_TRANSACTIONS } from '../services/mockData';

export function useLedger() {
  const [shopInfo] = useState(INITIAL_SHOP_INFO);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selectedDate, setSelectedDate] = useState("2026-07-26"); // Default to today
  
  // Animation state for newly added entry
  const [writingTransactionId, setWritingTransactionId] = useState(null);

  // Available dates in transaction history
  const datesList = useMemo(() => {
    const dates = Object.keys(transactions);
    if (!dates.includes(selectedDate)) dates.push(selectedDate);
    return dates.sort().reverse();
  }, [transactions, selectedDate]);

  // Current day's transactions
  const currentDayTransactions = useMemo(() => {
    return transactions[selectedDate] || [];
  }, [transactions, selectedDate]);

  // Calculate daily totals for selected date
  const dailyMetrics = useMemo(() => {
    const txs = transactions[selectedDate] || [];
    let totalSales = 0;
    let nogodCash = 0;
    let bakiAdded = 0;
    let bakiPaid = 0;

    txs.forEach((tx) => {
      if (tx.type === "NOGOD") {
        totalSales += tx.amount;
        nogodCash += tx.amount;
      } else if (tx.type === "BAKI") {
        totalSales += tx.amount;
        bakiAdded += tx.amount;
      } else if (tx.type === "PAYMENT") {
        bakiPaid += tx.amount;
        nogodCash += tx.amount;
      }
    });

    return { totalSales, nogodCash, bakiAdded, bakiPaid };
  }, [transactions, selectedDate]);

  // Calculate global total unpaid baki across all customers
  const totalGlobalBaki = useMemo(() => {
    return customers.reduce((sum, c) => sum + (c.totalBaki || 0), 0);
  }, [customers]);

  // Add a new transaction into ledger with ink animation
  const addTransaction = useCallback((newTxData) => {
    const id = `tx-${Date.now()}`;
    const dateStr = selectedDate;

    const timeFormatted = new Date().toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const newTx = {
      id,
      time: timeFormatted,
      customer: newTxData.customer || "নগদ খদ্দের",
      customerId: newTxData.customerId || null,
      item: newTxData.item || "পণ্য",
      amount: Number(newTxData.amount) || 0,
      type: newTxData.type || "NOGOD",
      notes: newTxData.notes || "",
      confidence: newTxData.confidence || 0.98
    };

    // Update transactions dictionary
    setTransactions((prev) => {
      const existing = prev[dateStr] || [];
      return {
        ...prev,
        [dateStr]: [newTx, ...existing]
      };
    });

    // Update Customer Baki Balance if BAKI or PAYMENT
    if (newTxData.customerId) {
      setCustomers((prev) =>
        prev.map((cust) => {
          if (cust.id === newTxData.customerId) {
            let updatedBaki = cust.totalBaki;
            if (newTxData.type === "BAKI") {
              updatedBaki += newTxData.amount;
            } else if (newTxData.type === "PAYMENT") {
              updatedBaki = Math.max(0, updatedBaki - newTxData.amount);
            }
            return {
              ...cust,
              totalBaki: updatedBaki,
              lastTransactionDate: dateStr
            };
          }
          return cust;
        })
      );
    } else if (newTxData.type === "BAKI" && newTxData.customer) {
      // Create new customer entry if person is not in system
      const newCustId = `cust-${Date.now()}`;
      setCustomers((prev) => [
        ...prev,
        {
          id: newCustId,
          name: newTxData.customer,
          displayName: newTxData.customer,
          phone: "01700-000000",
          address: "কারওয়ান বাজার",
          totalBaki: newTxData.amount,
          lastTransactionDate: dateStr,
          trustScore: "নতুন",
          avatarColor: "#D84315"
        }
      ]);
    }

    // Trigger signature GSAP ink write-in animation on this new entry
    setWritingTransactionId(id);

    return id;
  }, [selectedDate]);

  const clearWritingAnimation = useCallback(() => {
    setWritingTransactionId(null);
  }, []);

  return {
    shopInfo,
    customers,
    transactions,
    selectedDate,
    datesList,
    currentDayTransactions,
    dailyMetrics,
    totalGlobalBaki,
    writingTransactionId,
    setSelectedDate,
    addTransaction,
    clearWritingAnimation
  };
}
