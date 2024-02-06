var express = require("express");
var router = express.Router();
const slogan = require("../controllers/sloganController");
const { Slogan } = require("../models/Slogan");


router.route("/").post(slogan.addSlogan).get(paginatedResults(Slogan),slogan.getSlogans);
router
  .route("/:id")
  .patch(slogan.updateSlogan)
  .delete(slogan.deleteSlogan)
  .get(slogan.getSlogan);

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
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
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      if (!results.results) {
        return res.status(404).json("No Data Found");
      }
      res.paginatedResults = results;
      next();
    } catch (e) {
      return res.status(500).json("INTERNAL SERVER ERROR");
    }
  };
}

module.exports = router;
