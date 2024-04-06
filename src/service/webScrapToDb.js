const fs = require('fs');
const path = require('path');

class WebScrapToDb {
  async insertBseTrendlyneData(model, data, batchSize = 100) {
    const logFolder = path.join(__dirname, '..', 'logs', 'scrapper', 'trendlyne-bse');
    const logFileName = path.join(logFolder, `${new Date().toISOString().split('T')[0]}_${Date.now()}.log`);
    const logStream = fs.createWriteStream(logFileName, { flags: 'a' });
    try
    {
      const dataToInsert = data.map(row => ({
        bse_security_code: row.bse_security_code,
        trendlyne_stock_id: row.trendlyne_stock_id,
      }));

      const totalRecords = dataToInsert.length;
      let startIndex = 0;
      logStream.write(`***********************************************************\n`)
      logStream.write(`** Starting insertion                                    **\n`);
      logStream.write(`***********************************************************\n`)

      while (startIndex < totalRecords)
      {
        const endIndex = Math.min(startIndex + batchSize, totalRecords);
        const batchData = dataToInsert.slice(startIndex, endIndex);
        try
        {
          await model.bulkCreate(batchData, {
            updateOnDuplicate: ['bse_security_code', 'trendlyne_stock_id'],
          });

          logStream.write(`Inserted securities from ${batchData[0].bse_security_code} to ${batchData[batchData.length - 1].bse_security_code}\n`);
        } catch (error)
        {
          logStream.write(`Error while inserting securities from ${batchData[0].bse_security_code} to ${batchData[batchData.length - 1].bse_security_code}\n`);
          logStream.write(`******************** Error ********************\n`)
          logStream.write(error.message)
          logStream.write(`***********************************************`)
        }
        startIndex += batchSize;
      }
      console.log(`Data has been successfully inserted into the database`);
      logStream.write(`***********************************************************\n`)
      logStream.write(`** Data has been successfully inserted into the database **\n`);
      logStream.write(`***********************************************************\n`)

    } catch (error)
    {
      console.error('Error:', error);
      logStream.write(`Error inserting securities: ${error.message}\n`);
    } finally
    {
      logStream.end();
    }
  }

  async insertNseTrendlyneData(model, data, batchSize = 100) {
    const logFolder = path.join(__dirname, '..', 'logs', 'scrapper', 'trendlyne-nse');
    const logFileName = path.join(logFolder, `${new Date().toISOString().split('T')[0]}_${Date.now()}.log`);
    const logStream = fs.createWriteStream(logFileName, { flags: 'a' });
    try
    {
      const dataToInsert = data.map(row => ({
        nse_symbol: row.nse_symbol,
        trendlyne_stock_id: row.trendlyne_stock_id,
      }));

      const totalRecords = dataToInsert.length;
      let startIndex = 0;
      logStream.write(`***********************************************************\n`)
      logStream.write(`** Starting insertion                                    **\n`);
      logStream.write(`***********************************************************\n`)

      while (startIndex < totalRecords)
      {
        const endIndex = Math.min(startIndex + batchSize, totalRecords);
        const batchData = dataToInsert.slice(startIndex, endIndex);
        try
        {
          await model.bulkCreate(batchData, {
            updateOnDuplicate: ['nse_symbol', 'trendlyne_stock_id'],
          });

          logStream.write(`Inserted securities from ${batchData[0].nse_symbol} to ${batchData[batchData.length - 1].nse_symbol}\n`);
        } catch (error)
        {
          logStream.write(`Error while inserting securities from ${batchData[0].nse_symbol} to ${batchData[batchData.length - 1].nse_symbol}\n`);
          logStream.write(`******************** Error ********************\n`)
          logStream.write(error.message)
          logStream.write(`***********************************************\n`)
        }
        startIndex += batchSize;
      }
      console.log(`Data has been successfully inserted into the database`);
      logStream.write(`***********************************************************\n`)
      logStream.write(`** Data has been successfully inserted into the database **\n`);
      logStream.write(`***********************************************************\n`)

    } catch (error)
    {
      console.error('Error:', error);
      logStream.write(`Error inserting securities: ${error.message}\n`);
    } finally
    {
      logStream.end();
    }
  }

  async insertNseSmeTrendlyneData(model, data, batchSize = 100) {
    const logFolder = path.join(__dirname, '..', 'logs', 'scrapper', 'trendlyne-nse-sme');
    const logFileName = path.join(logFolder, `${new Date().toISOString().split('T')[0]}_${Date.now()}.log`);
    const logStream = fs.createWriteStream(logFileName, { flags: 'a' });
    try
    {
      const dataToInsert = data.map(row => ({
        nse_symbol: row.nse_symbol,
        trendlyne_stock_id: row.trendlyne_stock_id,
      }));

      const totalRecords = dataToInsert.length;
      let startIndex = 0;
      logStream.write(`***********************************************************\n`)
      logStream.write(`** Starting insertion                                    **\n`);
      logStream.write(`***********************************************************\n`)

      while (startIndex < totalRecords)
      {
        const endIndex = Math.min(startIndex + batchSize, totalRecords);
        const batchData = dataToInsert.slice(startIndex, endIndex);
        try
        {
          await model.bulkCreate(batchData, {
            updateOnDuplicate: ['nse_symbol', 'trendlyne_stock_id'],
          });

          logStream.write(`Inserted securities from ${batchData[0].nse_symbol} to ${batchData[batchData.length - 1].nse_symbol}\n`);
        } catch (error)
        {
          logStream.write(`Error while inserting securities from ${batchData[0].nse_symbol} to ${batchData[batchData.length - 1].nse_symbol}\n`);
          logStream.write(`******************** Error ********************\n`)
          logStream.write(error.message)
          logStream.write(`***********************************************\n`)
        }
        startIndex += batchSize;
      }
      console.log(`Data has been successfully inserted into the database`);
      logStream.write(`***********************************************************\n`)
      logStream.write(`** Data has been successfully inserted into the database **\n`);
      logStream.write(`***********************************************************\n`)

    } catch (error)
    {
      console.error('Error:', error);
      logStream.write(`Error inserting securities: ${error.message}\n`);
    } finally
    {
      logStream.end();
    }
  }
}

module.exports = WebScrapToDb;




