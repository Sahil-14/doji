const cheerio = require("cheerio");
const puppeteer = require('puppeteer')

const fs = require('fs').promises; // Import the promises-based version of fs module
const path = require('path');

const db = require('../models');
const WebScrapToDb = require("../service/webScrapToDb");
const Bse = db.bse;
const BseTrendlyneMapping = db.bse_trendlyne_mapping

const compony = "cg power site:trendlyne.com";
const stockurl = `https://www.google.com/search?q=${compony}`
// https://www.google.com/search?q=ABB India Limited`
async function scrapStockId(page) {
  try
  {
    await page.setJavaScriptEnabled(true)
    await page.goto(stockurl, { waitUntil: "networkidle2" });
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



const main = async () => {
  let browser;
  try
  {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await scrapStockId(page);
  } catch (error)
  {
    console.error('Error:', error);
  } finally
  {
    // Close the browser after finishing the scraping
    if (browser)
    {
      await browser.close();
    }
  }
};

// Call the main function to start the scraping process
main();