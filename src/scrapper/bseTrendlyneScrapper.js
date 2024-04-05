const Scrapper = require("./scrapper");
const cheerio = require("cheerio");
const fs = require('fs').promises; // Import the promises-based version of fs module
const path = require('path');
const puppeteer = require('puppeteer')
const db = require('../models');
const WebScrapToDb = require("../service/webScrapToDb");
const { StockIdScrappingError } = require("../error/StockIdScrappingError");
const Bse = db.bse;
const BseTrendlyneMapping = db.bse_trendlyne_mapping

class BseTrendlyneScrapper extends Scrapper {
  constructor() {
    super();
  }

  scrapStockId = async (page, stockUrl, securityCode) => {
    try
    {
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
    const webScrapToDb = new WebScrapToDb();

    //get bse security id from db
    try
    {
      const bseEntries = await Bse.findAll({
        attributes: ['security_code', 'security_name']
      });

      if (!bseEntries)
      {
        console.log("No entries found in BSE table.")
        return;
      }
      securities = bseEntries.map(entry => ({
        securityCode: entry.security_code,
        securityName: entry.security_name
      }));

      console.log(securities.length);

    } catch (error)
    {
      console.error('Error while getting securities list');
      console.error('Error:', error);
      return;
    }

    try
    {
      browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage(); // Open a new page for each iteration
      for (var i = 0; i < securities.length; i++)
      {
        const securityName = securities[i].securityCode;
        const query = `${securityName} site:trendlyne.com`;
        const url = `https://www.google.com/search?q=${query}`
        try
        {
          const trendlyneStockId = await this.scrapStockId(page, url, securities[i].securityCode);
          if (trendlyneStockId !== "NA")
          {
            await dataToInsert.push({
              bse_security_code: securities[i].securityCode,
              trendlyne_stock_id: trendlyneStockId
            })
          }
        } catch (error)
        {

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
      const fp = path.join(__dirname, '..', 'data', 'trendlyneStockIds.json');
      await fs.writeFile(fp, JSON.stringify(dataToInsert, null, 2));
      console.log('Trendlyne scrapped stock ids has been successfully written to trendlyneStockIds.json');
    } catch (error)
    {
      console.error('Error while writing trendlyne scrapped stock ids to file:', error);
    }
    webScrapToDb.insertBseTrendlyneData(BseTrendlyneMapping, dataToInsert, 100)
  }
}

const scrapper = new BseTrendlyneScrapper();
scrapper.scrap();