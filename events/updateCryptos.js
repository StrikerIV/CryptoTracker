

// updateCryptos()

// async function updateCryptos() {

//     function cryptoObject(data) {
//         return CryptoObject = {
//             "lastUpdated": Date.now(),
//             "data": {
//                 "symbol": data.symbol,
//                 "name": data.name,
//                 "slug": data.slug,
//                 "market_data": {
//                     "price": data.market_data.price_usd,
//                     "volume-24": data.market_data.volume_last_24_hours,
//                     "real-volume-24": data.market_data.real_volume_last_24_hours,
//                     "percent-change-1": data.market_data.percent_change_usd_last_1_hour,
//                     "percent-change-24": data.market_data.percent_change_usd_last_24_hours,
//                     "ohlcv-1": {
//                         "open": data.market_data.ohlcv_last_1_hour.open,
//                         "high": data.market_data.ohlcv_last_1_hour.high,
//                         "low": data.market_data.ohlcv_last_1_hour.low,
//                         "close": data.market_data.ohlcv_last_1_hour.close,
//                         "volume": data.market_data.ohlcv_last_1_hour.volume,
//                     },
//                     "ohlcv-24": {
//                         "open": data.market_data.ohlcv_last_24_hour.open,
//                         "high": data.market_data.ohlcv_last_24_hour.high,
//                         "low": data.market_data.ohlcv_last_24_hour.low,
//                         "close": data.market_data.ohlcv_last_24_hour.close,
//                         "volume": data.market_data.ohlcv_last_24_hour.volume,
//                     }
//                 }
//             }
//         }
//     }

//     async function fetchPrice(symbol) {
//         if (!symbol === "btc") return
//         symbol = "bitcoin"

//         let url = `https://www.livecoinwatch.com/price/Bitcoin-BTC`

//         request(url, (err, res, html) => {
//             //console.log(html)
//             let $ = cheerio.load(html);
//             let test = $('span[class="price"]')
//             console.log(test.text())
//         })

//     }

//     let cryptoCurrenciesToTrack = await dbQuery(client, "SELECT * FROM mastercryptos WHERE tracking = 1")
//     let cryptoPrices = []

//     for (const crypto of cryptoCurrenciesToTrack.results) {
//         cryptoPrices.push(await fetchPrice(crypto.symbol))
//     }

// }