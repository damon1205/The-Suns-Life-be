const findProductbyBrandName = require("../services/getCategoryProducts.services");
const { sendResponse } = require("../../../utils/responseHandler");


const findProductbyBrand = async (req, res) => {
    const brandName = req.params.name; // Assuming you expect the name as a route parameter
    if (brandName) {
        const result = await findProductbyBrandName(brandName);
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

module.exports = findProductbyBrand;
