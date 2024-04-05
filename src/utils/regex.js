
// regex.js
function extractNumberFromUrl(url) {
  // Regular expression to match the number between two forward slashes
  const regex = /\/(\d+)\/(?=[^/]*$)/;

  // Extracting the number from the URL using match method with the regular expression
  const match = url.match(regex);

  // Extracted number
  const number = match ? match[1] : null;

  return number;
}


module.exports = { extractNumberFromUrl };
