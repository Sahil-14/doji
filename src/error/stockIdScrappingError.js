class StockIdScrappingError extends Error {
  statusCode = 400;
  stockId 
  error = ""
  constructor(message) {
    super();
    this.error = message
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.error,
      },
    ];
  }
}

module.exports = {
  StockIdScrappingError
}