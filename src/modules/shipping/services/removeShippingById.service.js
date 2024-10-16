const mongoose = require('mongoose');
const SHIPPING = require('../shipping.modal');

const removeShippingRegion = async (shippingId) => {
    try {

        const existingCartItem = await SHIPPING.findOne({
            _id: mongoose.Types.ObjectId(shippingId)
        });

        if (existingCartItem) {
            const response = await existingCartItem.remove();
            if (response) {
                return {
                    data: "shipping region removed successfully!",
                    status: true,
                    code: 200
                };
            }else{
                return {data:'Error While Removing Data',status:false,code:400}
            }
        }
        else{
            return{data:'Region Not Found',status:false,code:401}
        }
    } catch (error) {
        throw new Error(`Failed to remove : ${error.message}`);
    }
}

module.exports = removeShippingRegion;
