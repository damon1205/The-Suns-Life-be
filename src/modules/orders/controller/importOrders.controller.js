const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const orders = require('../../../databaseJson/orders.json');
const ProductServices = require("../../products/services");
const ProductModel = require("../../products/products.model");
const UserModel = require("../../user/user.model");
const counterIncrementor = require('../../../utils/counterIncrementer');

const importOrders = catchAsync(async (req, res) => {
  if (orders.length) {
    const generateRandomObjectId = () => {
      const objectIdLength = 24;
      const characters = 'abcdef0123456789';
      let objectId = '';

      for (let i = 0; i < objectIdLength; i++) {
        objectId += characters[Math.floor(Math.random() * characters.length)];
      }

      return objectId;
    };

    const findProduct = async (name) => {
      let res = await ProductModel.findOne({ name: name }, { productImageUrl: 1 });
      return res || "";
    };

    const groupedOrders = {};
    let subTotal = 0;
    for (const order of orders) {
      const orderNo = order["Order no."];
      let newOrderNo = "#" + order["Order no."] + " - Wix";
      if (!groupedOrders[newOrderNo]) subTotal = 0;
      let amountToPay = order['Total'];
      let couponName = order['Coupon code'] || "";
      if (!groupedOrders[newOrderNo]) {
        // let seqId = await counterIncrementor("Order");
        // let newOrderNo = `Wix - ${newOrderNo}`;
        let productRes = await findProduct(order["Item"]);
        let productImageUrl = productRes?.productImageUrl || ""
        let productId = productRes?._id || ""
        if (couponName) {
          subTotal += parseFloat((parseFloat(order['Price']) * order['Qty'] + parseFloat(order['Shipping rate'])).toFixed(2));
        }
        groupedOrders[newOrderNo] = {
          orderNo: newOrderNo,
          paymentMode: "online",
          transactionId: generateRandomObjectId(),
          userId: generateRandomObjectId(),
          amountToPay: order["Total"],
          deliveryCharge: order["Shipping rate"] || 0,
          deliveryMethod: order["Delivery method"] || "",
          deliveryTime: order["Delivery time"] || "",
          trackingNumber: order["Tracking no."] || "",
          paymentType: "pay360",
          paymentStatus: ((order["Payment status"] === "Partially Refunded" ? "refunded" : order["Payment status"]) || "")?.toLowerCase() || "",
          orderStatus: ((order["Fulfillment status"] === "Partially Fulfilled" ? "partiallyfulfilled" : order["Fulfillment status"]) || "")?.toLowerCase() || "",
          productDetail: [
            {
              productId,
              quantity: order["Qty"],
              productDetailsObj: {
                name: order["Item"],
                productImageUrl: productImageUrl,
                price: order["Price"],
              },
            },
          ],
          shippingAdderess: {
            shippingAddressObj: {
              email: order["Contact email"] || "",
              firstName: "",
              lastName: "",
              address: order["Delivery address"] || "",
              city: order["Delivery city"] || "",
              state: order["Delivery state"] || "",
              iso: order["Delivery country"] || "",
              country: order["Delivery country"] || "",
              zip: String(order["Delivery ZIP/postal code"] || "")?.replace(/["']/g, "") || "",
              phone: String(order["Recipient phone no."] || "")?.replace(/["']/g, "") || "",
              addressLine2: order["Shipping label"] || "",
              orderNotes: order["Additional checkout info"] || "",
            },
          },
          createdAt: new Date(`${order["Date"]} ${order["Time"]}`).toISOString(),
          updatedAt: new Date(`${order["Date"]} ${order["Time"]}`).toISOString(),
          // seqId
        };
      } else {
        let productRes = await findProduct(order["Item"]);
        let productImageUrl = productRes?.productImageUrl || ""
        let productId = productRes?._id || ""
        if (couponName) {
          subTotal = parseFloat((parseFloat(subTotal) + parseFloat((parseFloat(order['Price']) * parseFloat(order["Qty"])).toFixed(2))).toFixed(2));
        }

        groupedOrders[newOrderNo].productDetail.push({
          productId,
          quantity: order["Qty"],
          productDetailsObj: {
            name: order["Item"],
            productImageUrl: productImageUrl,
            price: order["Price"],
          },
        });

        const date = order["Date"];
        const time = order["Time"];
        const orderDateTime = new Date(`${date} ${time}`).toISOString();

        if (orderDateTime < groupedOrders[newOrderNo].createdAt) {
          groupedOrders[newOrderNo].createdAt = orderDateTime;
        }

        if (orderDateTime > groupedOrders[newOrderNo].updatedAt) {
          groupedOrders[newOrderNo].updatedAt = orderDateTime;
        }
      }
      if (couponName != "" && subTotal !== amountToPay) {
        groupedOrders[newOrderNo].couponName = order["Coupon code"] || "";
        groupedOrders[newOrderNo].couponDiscount = parseFloat(parseFloat(subTotal - amountToPay).toFixed(2)) || 0;
      }

      const recipientName = order["Recipient name"] || "";
      const recipientNameParts = recipientName.split(' ');

      if (recipientNameParts.length >= 2) {
        groupedOrders[newOrderNo].shippingAdderess.shippingAddressObj.firstName = recipientNameParts[0];
        groupedOrders[newOrderNo].shippingAdderess.shippingAddressObj.lastName = recipientNameParts.slice(1).join(' ');
      } else {
        groupedOrders[newOrderNo].shippingAdderess.shippingAddressObj.firstName = recipientName;
        groupedOrders[newOrderNo].shippingAdderess.shippingAddressObj.lastName = "";
      }
    }
    const orderDetailsArray = Object.values(groupedOrders);

    let addResponse = await orderServices.importOrders(orderDetailsArray);
    if (addResponse?.status) {
      sendResponse(res, httpStatus.OK, addResponse?.data, null);
    } else {
      sendResponse(res,
        addResponse?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
          : httpStatus.BAD_REQUEST,
        addResponse?.msg,
        null);
    }
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, `Orders Array Is Empty!`);
  }
});

module.exports = importOrders;
