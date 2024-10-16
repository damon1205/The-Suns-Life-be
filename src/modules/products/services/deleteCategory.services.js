const mongoose = require('mongoose');
const CategoryModal = require('../products.model');

const deleteCategory = async (name) => {
    try {
    
        let filterQuery = { active: true, brand: name };

        const removed = await CategoryModal.updateMany(filterQuery, { $set: { active: false } });

        if (removed) {
            return { data: removed, message: "Category deleted Successfully", status: true, code: 200 };
        } else {
            return { data: "Category Not Found", status: false, code: 400 };
        }
    } catch (error) {
        
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = deleteCategory;
