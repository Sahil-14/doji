const CSVToDB = require('../service/csvToDb');
const fs = require('fs');
const path = require('path');
const db = require("../models");
const { parseCSV } = require('../utils/csv');
const Bse = db.bse;


(async () => {
  try
  {
    await db.sequelize.sync();

    // Read CSV file
    const csvFilePath = path.join(__dirname, '..', 'data', 'bse-equity.csv');
    console.log("Reading CSV: " + csvFilePath);
    const csvData = await parseCSV(csvFilePath);
    console.log(csvData.length)
    const csvToDBService = new CSVToDB();
    await csvToDBService.insertBseStocksData(Bse, csvData, 100); // Insert data in batches of 100 records
  } catch (error)
  {
    console.error('Error:', error);
  }
})();

