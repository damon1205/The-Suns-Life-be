
const mongoose = require('mongoose');
const OrderModel = require('../order.model'); 

const getTopCountryTotalAmount = async (filter) => {
    try {
       
        const orders = await OrderModel.aggregate([
            {
                $match: {
                    paymentStatus: 'paid' 
                }
            },
            {
                $group: {
                    _id: "$userId",
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: "$amountToPay" },
                    shippingAddresses: { $addToSet: "$shippingAdderess" }
                }
            },
            {
                $lookup: {
                    from: "users", // Replace "users" with the actual name of the users collection/table
                    localField: "_id", // Use _id instead of userId
                    foreignField: "_id",
                    as: "userData"
                },
            },
           /*  {
                $lookup: {
                    from: "addresses", // Replace "userAddress" with the actual name of the userAddress collection/table
                    localField: "_id", // Use _id instead of userId
                    foreignField: "userId", // Assuming userId is the field in the userAddress table that corresponds to the user's ID
                    as: "userAddress"
                }
            }, */
        
        ]);
  
        // Convert the result to an object
        let userOrderSummary = [];
        orders.forEach(order => {
            const { _id, totalOrders, totalAmount, shippingAddresses, userData } = order;
           
            const user = userData[0]; // Assuming there's only one user for each order
                 totalAmount=totalAmount.toFixed(2)
    
            userOrderSummary.push({
                userId: _id,
                totalOrders,
                totalAmount,
                shippingAddresses,
                user
                // Add other fields from the users table as needed
            });
        });
        
        userOrderSummary.sort((a, b) => b.totalOrders - a.totalOrders);

      // Get the top 5 orders
const topFiveUserOrderSummary =  userOrderSummary.slice(0, 5);

     
        if ( topFiveUserOrderSummary .length > 0) {
            return { data:  topFiveUserOrderSummary , status: true, code: 200 };
        } else {
            return { data: "No orders", status: false, code: 400 };
        }
    } catch (error) {
        
    }
   
    
    
      
     

  };

  module.exports = getTopCountryTotalAmount;
