const { parse } = require('csv-parse');
const fs = require('fs');



const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const csvData = [];
    console.log("Parsing CSV: " + filePath);
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', function (csvrow) {
        csvData.push(csvrow);
      })
      .on('end', function () {
        console.log("Total rows parse: " + csvData.length);
        console.log("Parsing completed!");
        resolve(csvData); // Resolve the promise with csvData when parsing is completed
      })
      .on('error', function (error) {
        console.error("Error occurred during parsing:", error);
        reject(error); // Reject the promise if an error occurs during parsing
      });
  });
};


module.exports = { parseCSV };
