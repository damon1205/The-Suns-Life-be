const mongoose = require("mongoose");
const axios = require("axios");
const orderModel = require("../../orders/order.model");

const addRoyalMailOrder = async (data) => {
  try {
    console.log("paylod==========", data.orderId);
    let payload = JSON.stringify({
      items: [
        {
          orderReference: data?.orderId,
          recipient: {
            address: {
              fullName: data?.user?.fName + " " + data?.user?.lName,
              companyName: "",
              addressLine1: data?.address?.shippingAddressObj?.address,
              addressLine2: data?.address?.shippingAddressObj?.addressLine2
                ? data?.address?.shippingAddressObj?.addressLine2
                : "",
              addressLine3: "",
              city: data?.address?.shippingAddressObj?.city,
              county: data?.address?.shippingAddressObj?.city,
              postcode: data?.address?.shippingAddressObj?.zip,
              countryCode: data?.address?.shippingAddressObj?.iso,
            },
            phoneNumber: data?.address?.shippingAddressObj?.phone,
            emailAddress: data?.user?.email,
            addressBookReference: "",
          },
          sender: {
            tradingName: "THE SNUS LIFE LIMITED",
            phoneNumber: "07712884955",
            emailAddress: "info@thesnuslife.co.uk",
          },
          billing: {
            address: {
              fullName: data?.user?.fName + " " + data?.user?.lName,
              companyName: "",
              addressLine1: data?.address?.shippingAddressObj?.address,
              addressLine2: data?.address?.shippingAddressObj?.addressLine2
                ? data?.address?.shippingAddressObj?.addressLine2
                : "",
              addressLine3: "",
              city: data?.address?.shippingAddressObj?.city,
              county: data?.address?.shippingAddressObj?.city,
              postcode: data?.address?.shippingAddressObj?.zip,
              countryCode: "GB",
            },
            phoneNumber: data?.address?.shippingAddressObj?.phone,
            emailAddress: data?.user?.email,
          },
          packages: [
            {
              weightInGrams: 100,
              packageFormatIdentifier: "mediumParcel",
              customPackageFormatIdentifier: "mediumParcel",
              dimensions: {
                heightInMms: 100,
                widthInMms: 100,
                depthInMms: 100,
              },
              contents: [
                {
                  name: data?.product,
                  SKU: "pr1",
                  quantity: data?.quantity,
                  unitValue: 1,
                  "customsCode": "SNUSLIFE",
                  unitWeightInGrams: 10,
                  customsDescription: "product1",
                  "customsDeclarationCategory": "Other",
                  extendedCustomsDescription: "product1 ",
                  customsCode: "",
                  originCountryCode: "GB",
                  customsDeclarationCategory: "none",
                  requiresExportLicence: true,
                  stockLocation: "United Kingdom",
                },
              ],
            },
          ],
          orderDate: new Date().toISOString(),

          specialInstructions: "product",
          subtotal: data?.amount,
          shippingCostCharged: data?.deliveryCharge,
          otherCosts: 0,

          total: data?.total,
          currencyCode: "GBP",
          postageDetails: {
            sendNotificationsTo: "sender",
            serviceCode: data?.serviceId,

            guaranteedSaturdayDelivery: false,
          },

          tags: [
            {
              key: "SNUS",
              value: "SNUS",
            },
          ],
          label: {
            includeLabelInResponse: true,
            includeCN: true,
            includeReturnsLabel: true,
          },
          orderTax: 1,
        },
      ],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.parcel.royalmail.com/api/v1/orders",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ROYAL_MAIL_KEY}`,
      },
      data: payload,
    };

    axios
      .request(config)
      .then(async (response) => {
        console.log("royal mail response", response);
        if (response?.status == 200) {
          if (response?.data?.successCount == 1) {
            let royalmailId = response?.data?.createdOrders[0]?.orderIdentifier;
            let trackNumber = response?.data?.createdOrders[0]?.trackingNumber;
            console.log(
              "royal mail order id",
              response?.data?.createdOrders[0]
            );

            const updateResult = await orderModel.findByIdAndUpdate(
              data?.orderId,
              {
                royalMailId: royalmailId.toString(),
                trackingNumber: trackNumber.toString(),

                trackingURL: "https://www.royalmail.com/track-your-item",
              },
              { new: true }
            );
          }
        }
      })
      .catch((error) => {
        console.log("Error while Royal Mail create Order ", error);
      });

    // return { data: insertResult, status: true, code: 200 };
  } catch (error) {
    //  return { status: false, code: 500, msg: error.message }
  }
};

module.exports = addRoyalMailOrder;
