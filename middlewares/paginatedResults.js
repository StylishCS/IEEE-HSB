// Import Mongoose
const mongoose = require("mongoose");

// Modify the middleware to accept a Mongoose model
function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    // Use Mongoose's countDocuments() method
    try {
      const totalDocuments = await model.countDocuments();
      results.totalPages = Math.ceil(totalDocuments / limit);

      if (endIndex < totalDocuments) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      results.results = await model.find().limit(limit).skip(startIndex).exec();
      if (!results.results || results.results.length === 0) {
        return res.status(404).json({ message: "No Data Found" });
      }
      res.paginatedResults = results;
      next();
    } catch (error) {
      console.error("Error fetching paginated results:", error);
      return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
  };
}

module.exports = paginatedResults;
