const sortModel = require("../sortby.modal");
const mongoose = require('mongoose');

const adminAddsort = async (sortData) => {
    try {
        if (sortData === null || Object.keys(sortData)?.length === 0) {
            return { data: "Nothing to Add", status: false, code: 400 }
        } else {
           

            let addResult = await sortModel.create({
                ...sortData, isDefault: true,
            })
            if (addResult) {
                return { data: addResult, status: true, code: 200 };
            }
            else {
                return { data: "Error while adding address", status: false, code: 400 };
            }
        }
    } catch (error) {
        console.log("Error while getting data:", error);
        return { status: false, code: 500, data: error };
    }
}

module.exports = adminAddsort;
