const fs = require('fs').promises;
const path = require('path');

class Scrapper {
  constructor() { }

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

  findSegmentWithFirstNumber(segments) {
    for (const segment of segments)
    {
      if (!isNaN(segment))
      {
        return segment;
      }
    }
    return "NA";
  }

  getStockIdFromUrl(url) {
    try
    {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const segments = pathname.split('/').filter(segment => segment !== '');
      const stockId = this.findSegmentWithFirstNumber(segments)
      return stockId;
    } catch (error)
    {
      console.log(error);
      return "NA"
    }

  }
  async logFailedScrap(stockUrl, securityCode) {
    const filePath = path.join(__dirname, '..', 'data', 'failedScrap.json');

    try
    {
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
}

module.exports = Scrapper;
