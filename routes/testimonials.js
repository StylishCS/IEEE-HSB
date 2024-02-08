const express = require("express");
const router = express.Router();
const multer = require("multer");
const testimonial = require("../controllers/testimonialsController");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");
const paginatedResults = require("../middlewares/paginatedResults");
const { Testimonial } = require("../models/testimonials");

const fileUpload = multer();

router.post(
  "/",
  fileUpload.single("image"),
  uploadToCloudinary,
  testimonial.addTestimonial
);

router.get("/", paginatedResults(Testimonial), testimonial.getTestimonials);

router
  .route("/:id")
  .patch(
    fileUpload.single("image"),
    uploadToCloudinary,
    testimonial.updateTestimonial
  )
  .delete(testimonial.deleteTestimonial)
  .get(testimonial.getTestimonial);

module.exports = router;
