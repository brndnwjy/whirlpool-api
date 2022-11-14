const response = (res, result, status, message) => {
  const resultPrint = {};
  resultPrint.status = "success";
  resultPrint.statusCode = status;
  resultPrint.message = message || null;
  resultPrint.data = result;

  res.status(status).json(resultPrint);
};

module.exports = response;
