const { Testimonial } = require("../models/testimonials");
const cloudinary = require("../utils/cloudinary");

exports.addTestimonial = async (req, res) => {
  try {
    if (!req.cloudinaryResult) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const testimonial = new Testimonial({
      name: req.body.name,
      image: req.cloudinaryResult.secure_url,
      lastPosition: req.body.lastPosition,
      season: req.body.season,
      comment: req.body.comment,
    });

    await testimonial.save();

    return res.status(200).json({ msg: "Comment added successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    return res.status(200).json(res.paginatedResults);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ msg: "Not Found" });

    if (req.file) {
      req.body.image = req.cloudinaryResult.secure_url;
      const publicId = testimonial.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Testimonial.updateOne({ _id: req.params.id }, req.body);
    return res.status(200).json({ msg: "Updated Successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById({ _id: req.params.id });
    if (!testimonial) return res.status(404).json({ msg: "Not Found" });
    const publicId = testimonial.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
    await Testimonial.deleteOne({ _id: req.params.id });
    return res.status(200).json({ msg: "Deleted Successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};

exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById({ _id: req.params.id });
    if (!testimonial) return res.status(404).json({ msg: "Not Found" });
    return res.status(200).json({ status: "success", data: testimonial });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};
