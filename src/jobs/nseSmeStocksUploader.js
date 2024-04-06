const CSVToDB = require('../service/csvToDb');
const path = require('path');
const db = require("../models");
const { parseCSV } = require('../utils/csv');
const NseSME = db.nse_sme;


(async () => {
  try
  {
    await db.sequelize.sync();
    const csvFilePath = path.join(__dirname, '..', 'data', 'nse-sme-equity.csv');
    console.log("Reading CSV: " + csvFilePath);
    const csvData = await parseCSV(csvFilePath);
    console.log(csvData.length)
    const csvToDBService = new CSVToDB();
    await csvToDBService.insertNseStocksData(NseSME, csvData, 100, "nse-sme"); // Insert data in batches of 100 records
  } catch (error)
  {
    console.error('Error:', error);
  }
})();

