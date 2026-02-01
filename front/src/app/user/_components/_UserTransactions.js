import React, { useEffect, useState } from "react";

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/get-user-transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
        }
      } catch (error) {
      }
    };

    fetchTransactions();
  }, []);

  const withdrawals = transactions.filter(
    (transaction) => transaction.type === "withdrawal"
  );
  const payments = transactions.filter(
    (transaction) => transaction.type !== "withdrawal"
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Transactions</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Withdrawals</h2>
        {withdrawals.length === 0 ? (
          <p>Not yet...</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4">
            {withdrawals.map((transaction) => (
              <li key={transaction._id} className="p-4 border rounded shadow">
                {transaction.type}: ${transaction.amount_usd} currency{" "}
                {transaction.currency} to {transaction.wallet_address} on{" "}
                {new Date(transaction.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Payments</h2>
        {payments.length === 0 ? (
          <p>Not yet...</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4">
            {payments.map((transaction) => (
              <li key={transaction._id} className="p-4 border rounded shadow">
                {transaction.type}: ${transaction.amount_usd} (
                {transaction.amount_crypto}) on{" "}
                {new Date(transaction.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserTransactions;
