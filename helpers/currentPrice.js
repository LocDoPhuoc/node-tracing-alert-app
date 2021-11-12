const axios = require("axios");

module.exports = async (symbol) => {
  try {
    let url = 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion?convert=USD&amount=1&CMC_PRO_API_KEY=a22ba993-73ce-4224-ac4e-330bbf39722f&symbol=' + symbol;
    
    const res = await axios.get(url);

    return {
      error: false,
      price: res.data.data.quote.USD.price,
    };
  } catch (error) {
    console.error("Fetch price error", error);
    return { error: true };
  }
};
