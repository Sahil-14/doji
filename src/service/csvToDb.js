const fs = require('fs');
const path = require('path');

class CSVToDB {
  async insertBseStocksData(model, csvData, batchSize = 100) {
    const logFolder = path.join(__dirname, '..', 'logs');
    const logFileName = path.join(logFolder, `bse-${new Date().toISOString().split('T')[0]}_${Date.now()}.log`);
    const logStream = fs.createWriteStream(logFileName, { flags: 'a' });
    try
    {
      const dataToInsert = csvData.slice(1).map(row => ({
        security_code: row[0],
        issuer_name: row[1],
        security_id: row[2],
        security_name: row[3],
        status: row[4],
        group: row[5],
        face_value: row[6],
        isin_no: row[7],
        industry: row[8],
        instrument: row[9],
        sector_name: row[10],
        industry_new_name: row[11],
        igroup_name: row[12],
        isubgroup_name: row[13],
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
            updateOnDuplicate: ['security_code'],
          });

          logStream.write(`Inserted securities from ${batchData[0].security_code} to ${batchData[batchData.length - 1].security_code}\n`);

        } catch (error)
        {
          logStream.write(`Error while inserting securities from ${batchData[0].securityCode} to ${batchData[batchData.length - 1].securityCode}\n`);
          logStream.write(`******************** Error ********************`)
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
  async insertNseStocksData(model, csvData, batchSize = 100, logFilePrefix = "nse") {
    const logFolder = path.join(__dirname, '..', 'logs');
    const logFileName = path.join(logFolder, `${logFilePrefix}-${new Date().toISOString().split('T')[0]}_${Date.now()}.log`);
    const logStream = fs.createWriteStream(logFileName, { flags: 'a' });
    try
    {
      const dataToInsert = csvData.slice(1).map(row => ({
        symbol: row[0],
        compony_name: row[1],
        series: row[2],
        date_of_listing: row[3],
        paid_up_value: row[4],
        market_lot: row[5],
        isni_no: row[6],
        face_value: row[7]
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
            updateOnDuplicate: ['symbol'],
          });

          logStream.write(`Inserted securities from ${batchData[0].symbol} to ${batchData[batchData.length - 1].symbol}\n`);

        } catch (error)
        {
          logStream.write(`Error while inserting securities from ${batchData[0].security_code} to ${batchData[batchData.length - 1].security_code}\n`);
          logStream.write(`******************** Error ********************`)
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
}

module.exports = CSVToDB;




