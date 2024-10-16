const findProductByName = require("../services/getProductsByName.service");
const { sendResponse } = require("../../../utils/responseHandler");


const findProductByNameController = async (req, res) => {
  const productName = req.params.name; // Assuming you expect the name as a route parameter
  if (productName) {
    const result = await findProductByName(productName);
    res.status(result.code).json(result)
  } else {
    if (result?.code === 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
    } else if (result?.code === 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
    } else if (result?.code === 404) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data)
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, result);
    }
  }
};

module.exports = findProductByNameController;
