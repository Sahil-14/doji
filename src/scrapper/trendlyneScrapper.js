const cheerio = require("cheerio");
const fs = require('fs').promises; // Import the promises-based version of fs module
const path = require('path');
const puppeteer = require('puppeteer')

const db = require('../models');
const WebScrapToDb = require("../service/webScrapToDb");
const Bse = db.bse;
const BseTrendlyneMapping = db.bse_trendlyne_mapping

async function scrapStockId(page, stockUrl, securityCode) {
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
    const stockId = getStockIdFromUrl(hrefValue);
    console.log(stockId)
    return stockId;
  } catch (e)
  {
    console.error(`Error while scraping stockid for ${securityCode}`, e)
    await logFailedScrap(stockUrl, securityCode);
    throw new StockIdScrappingError(`Error while scraping stockid for ${securityCode}`)
  }
}

function findSegmentWithFirstNumber(segments) {
  for (const segment of segments)
  {
    if (!isNaN(segment))
    {
      return segment;
    }
  }
  return null;
}
const getStockIdFromUrl = (url) => {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const segments = pathname.split('/').filter(segment => segment !== '');
  const stockId = findSegmentWithFirstNumber(segments)
  return stockId;
}

const scrap = async () => {
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
    for (var i = 0; i < 10; i++)
    {
      const securityName = securities[i].securityCode;
      const query = `${securityName} site:trendlyne.com`;
      const url = `https://www.google.com/search?q=${query}`
      try
      {
        const trendlyneStockId = await scrapStockId(page, url, securities[i].securityCode);
        await dataToInsert.push({
          bse_security_code: securities[i].securityCode,
          trendlyne_stock_id: trendlyneStockId
        })
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
  // insert in db
  webScrapToDb.insertBseTrendlyneData(BseTrendlyneMapping, dataToInsert, 100)

}

async function logFailedScrap(stockUrl, securityCode) {
  const filePath = path.join(__dirname, '..', 'data', 'failedTrendlyneScrap.json');

  try
  {
    // Read existing failed attempts (if any) from file
    let failedAttempts = [];
    try
    {
      const fileContent = await fs.readFile(filePath, 'utf8');
      failedAttempts = JSON.parse(fileContent);
    } catch (error)
    {
      if (error.code !== 'ENOENT')
      {
        console.error('Error reading failed scrap file:', error);
      }
    }
    if (!failedAttempts.some(attempt => attempt.securityCode === securityCode))
    {
      failedAttempts.push({ stockUrl, securityCode });
      await fs.writeFile(filePath, JSON.stringify(failedAttempts, null, 2));
      console.log(`Failed attempt logged for ${securityCode} at ${stockUrl}`);
    }
  } catch (error)
  {
    console.error('Error logging failed scrap:', error);
  }
}

scrap();