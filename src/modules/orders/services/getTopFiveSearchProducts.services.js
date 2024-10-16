const orderModel = require('../order.model');

const getserchTopFiveProduct = async (name) => {
    try {

        let filterQuery={
            active:true
        }
       console.log(name,"name");
        

        const orders = await orderModel.find({
            filterQuery,
            // "productDetail.productDetailsObj.name": { $regex: name, $options: 'i' }
        });

        return {
            data: orders,
            status: true,
            code: 200,
        };
    } catch (error) {
        return {
            data: error.message,
            status: false,
            code: 500,
        };
    }
}

module.exports = getserchTopFiveProduct;
