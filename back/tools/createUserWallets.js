const Wallet = require("../models/Wallet");

const createUserWallets = async (userEmail) => {
  const fetch = (await import("node-fetch")).default; // Dynamic import for node-fetch

  const url = "https://api.cryptocloud.plus/v2/invoice/static/create";
  const headers = {
    Authorization: `Token ${process.env.API_KEY}`,
    "Content-Type": "application/json",
  };

  const shopId = process.env.SHOP_ID;
  const cryptocurrencies = [
    "BTC",
    "LTC",
    "ETH",
    "USDT_TRC20",
    "USDC_TRC20",
    "TUSD_TRC20",
    "USDT_ERC20",
    "USDC_ERC20",
    "TUSD_ERC20",
  ];

  const walletData = {
    email: userEmail,
  };

  for (const currency of cryptocurrencies) {
    const body = {
      shop_id: shopId,
      currency: currency,
      identify: userEmail,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the wallet address in the walletData object
        const addressField = `${currency
          .toLowerCase()
          .replace(/_/g, "")}_address`;
        walletData[addressField] = data.result.address;
      } else {
        throw new Error(
          `Failed to fetch for ${currency}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.log(`Fail for ${currency}:`, error);
    }
  }

  // Create and save the Wallet instance
  try {
    const wallet = new Wallet(walletData);
    await wallet.save();
    console.log("Wallet saved successfully:", wallet);
  } catch (error) {
    console.error("Error saving wallet:", error);
  }
};

module.exports = createUserWallets;
