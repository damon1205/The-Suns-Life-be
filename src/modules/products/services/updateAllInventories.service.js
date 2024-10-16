const ProductsModel = require("../products.model");

const updateAllInventories = async (filterObj, updateObj) => {
    try {
        const result = await ProductsModel.findOneAndUpdate(
            filterObj,
            { $set: updateObj },
            { returnDocument: 'after' }
        );
        if (result) {
            return { status: true, code: 201, result }
        }
    } catch (error) {
        console.log("Error while updating inventory:-", error)
        return { status: false, code: 500, msg: error }
    }
}

module.exports = updateAllInventories