import React, { useState } from "react";

const GetWithdrawal = () => {
  const [amountToWithdraw, setAmountToWithdraw] = useState(0);
  const [amountInUsd, setAmountInUsd] = useState(0);
  const [currency, setCurrency] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState("");

  const cryptocurrencies = [
    "USDT (TRC20)",
    "USDC (TRC20)",
    "TUSD (TRC20)",
    "USDT (ERC20)",
    "USDC (ERC20)",
    "TUSD (ERC20)",
    "Bitcoin",
    "Litecoin",
    "Ethereum",
  ];

  const fetchWithdrawalInUsd = async (entry) => {
    const currency = localStorage.getItem("currency");
    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies/${currency.toLowerCase()}.json`
      );
      if (response.ok) {
        const currencyData = await response.json();
        const conversionRate = currencyData[currency.toLowerCase()]["usd"];

        if (typeof conversionRate !== "number" || isNaN(conversionRate)) {
          return;
        }

        if (currency.toLowerCase() !== "usd") {
          setAmountInUsd(amountToWithdraw * conversionRate);
        } else {
          setAmountInUsd(amountToWithdraw);
        }
      } else {
      }
    } catch (error) {
    }
  };
  const handleWithdrawal = async (e) => {
    e.preventDefault();
    await fetchWithdrawalInUsd();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/withdrawal`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount_usd: amountInUsd,
            currency,
            wallet_address: walletAddress,
          }),
        }
      );

      if (response.ok) {
        setIsSuccessful(true);
        setError("");
        setTimeout(() => {
          setIsSuccessful(false);
        }, 5000);
      }
    } catch (error) {
      setIsSuccessful(false);
      setError("An error occurred during withdrawal");
    }
  };

  return (
    <div className="text-black">
      <h1 className="text-red-500">{error}</h1>
      <form onSubmit={handleWithdrawal}>
        <div className="mb-4">
          <label className="text-white" htmlFor="currency">
            Cryptocurrency:
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="">Select a cryptocurrency</option>
            {cryptocurrencies.map((crypto) => (
              <option key={crypto} value={crypto}>
                {crypto}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-white" htmlFor="amountUSD">
            Amount :
          </label>
          <input
            type="number"
            id="amountToWithdraw"
            value={amountToWithdraw}
            onChange={(e) => setAmountToWithdraw(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="text-white" htmlFor="walletAddress">
            Wallet Address:
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>
        <button className="text-white" type="submit">
          Submit Withdrawal
        </button>
      </form>
      {isSuccessful && (
        <div className="bg-green-200 text-green-700 p-4 mb-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Withdrawal was successful
        </div>
      )}
    </div>
  );
};

export default GetWithdrawal;
