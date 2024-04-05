const cron = require('node-cron');
const NseTrendlyneScrapper = require('../scrapper/nseTrendlyneScrapper');

cron.schedule('*/3 * * * *', async () => {
  try
  {
    const scrapper = new NseTrendlyneScrapper();
    await scrapper.scrap();
  } catch (error)
  {
    console.error('Error during scraping:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata' // Set your desired timezone
});
