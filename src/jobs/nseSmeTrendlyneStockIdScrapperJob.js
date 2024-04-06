const cron = require('node-cron');
const NseSmeTrendlyneScrapper = require('../scrapper/nseSmeTrendlyneScrapper');

cron.schedule('*/5 * * * *', async () => {
  try
  {
    const scrapper = new NseSmeTrendlyneScrapper();
    await scrapper.scrap();
  } catch (error)
  {
    console.error('Error during scraping:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata' // Set your desired timezone
});
