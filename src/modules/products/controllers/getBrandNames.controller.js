const getAllBrandNamesService = require('../services/getBrandNames.service')

const getAllBrandNamesController = async (req, res) => {
    try {
      const brandNames = await getAllBrandNamesService();
      res.status(200).json(brandNames);
    } catch (error) {
      console.error("Error while getting brand names:", error);
      res.status(500).json({ status: false, code: 500, msg: error.message });
    }
  };
module.exports = getAllBrandNamesController;
  