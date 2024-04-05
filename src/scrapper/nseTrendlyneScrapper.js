const Scrapper = require("./scrapper");
const cheerio = require("cheerio");
const fs = require('fs').promises; // Import the promises-based version of fs module
const path = require('path');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const db = require('../models');
const WebScrapToDb = require("../service/webScrapToDb");
const { StockIdScrappingError } = require("../error/StockIdScrappingError");
const Nse = db.nse;
const NseTrendlyneMapping = db.nse_trendlyne_mapping

/**
 * randomise delay
 * ramdomise  query param randomisation if more than 3 consecutive NA replace it 
 * 
 */
puppeteer.use(StealthPlugin());


class NseTrendlyneScrapper extends Scrapper {
  constructor() {
    super();
  }

  userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/116.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
  ];

  getRandomUserAgent() {
    const randomIndex = Math.floor(Math.random() * this.userAgents.length);
    return this.userAgents[randomIndex];
  }

  delay = async (ms) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }


  scrapStockId = async (page, stockUrl, securityCode, index) => {
    try
    {
      const userAgent = await this.getRandomUserAgent();
      await page.setUserAgent(userAgent);
      await page.setJavaScriptEnabled(true)
      await page.goto(stockUrl, { waitUntil: "networkidle2" });
      await page.setJavaScriptEnabled(true)
      const html = await page.content()
      const $ = cheerio.load(html)
      const searchDiv = $("div.MjjYud").first();
      const anchorTag = searchDiv.find("div.yuRUbf a");
      const hrefValue = anchorTag.attr("href");
      console.log(hrefValue)
      const stockId = this.getStockIdFromUrl(hrefValue);
      console.log(stockId)
      return stockId;
    } catch (e)
    {
      console.error(`Error while scraping stockid for ${securityCode}`, e)
      await logFailedScrap(stockUrl, securityCode);
      throw new StockIdScrappingError(`Error while scraping stockid for ${securityCode}`)
    }
  }

  scrap = async () => {
    let browser;
    var securities = [];
    var dataToInsert = [];
    var nseToTrendlyneMappedSecurities = [];
    const webScrapToDb = new WebScrapToDb();

    //get bse security id from db
    try
    {
      const nseEntries = await Nse.findAll({
        attributes: ['symbol', 'compony_name']
      });

      if (!nseEntries)
      {
        console.log("No entries found in NSE table.")
        return;
      }
      securities = nseEntries.map(entry => ({
        symbol: entry.symbol,
        componyName: entry.compony_name
      }));

      console.log(`Total componies in NSE : ${securities.length}`);
    } catch (error)
    {
      console.error('Error while getting securities list');
      console.error('Error:', error);
      return;
    }

    try
    {
      const nseEntries = await NseTrendlyneMapping.findAll({
        attributes: ['nse_symbol']
      });

      if (!nseEntries)
      {
        console.log("No entries found in nse_trendlyne_mappings table.")
      } else
      {
        nseToTrendlyneMappedSecurities = nseEntries.map(entry => entry.nse_symbol);
      }

    } catch (error)
    {
      console.error('Error while getting securities list');
      console.error('Error:', error);
      return;
    }

    try
    {
      browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      var counter = 0;
      for (var i = 0; i < securities.length; i++)
      {
        if (counter > 10)
        {
          break;
        }

        if (!nseToTrendlyneMappedSecurities.includes(securities[i].symbol))
        {
          const securityName = securities[i].componyName;
          const encodedSecurityName = encodeURIComponent(securityName);
          const query = `${encodedSecurityName} site:trendlyne.com`;
          const url = `https://www.google.com/search?q=${query} `
          try
          {
            const trendlyneStockId = await this.scrapStockId(page, url, securities[i].symbol, i);
            if (trendlyneStockId !== "NA")
            {
              await dataToInsert.push({
                nse_symbol: securities[i].symbol,
                trendlyne_stock_id: trendlyneStockId
              })
              counter++;
            }

          } catch (error)
          {

          }
          await this.delay(4000);
        }

      }
    } catch (error)
    {
      console.error('Error:', error);
    } finally
    {
      if (browser)
      {
        await browser.close();
      }
    }


    try
    {
      const fp = path.join(__dirname, '..', 'data', 'trendlyneNseStockIds.json');
      await fs.writeFile(fp, JSON.stringify(dataToInsert, null, 2));
      console.log('Trendlyne scrapped stock ids has been successfully written to trendlyneStockIds.json');
    } catch (error)
    {
      console.error('Error while writing trendlyne scrapped stock ids to file:', error);
    }
    if (dataToInsert)
    {
      webScrapToDb.insertNseTrendlyneData(NseTrendlyneMapping, dataToInsert, 100)
    } else
    {
      console.log("No data to insert in ")
    }
  }


}

// const scrapper = new NseTrendlyneScrapper();
// scrapper.scrap();

module.exports = NseTrendlyneScrapper;
