const { Partner } = require("../models/partners");
const cloudinary = require("../utils/cloudinary");

exports.addPartner = async (req, res) => {
  try {
    if (!req.cloudinaryResult) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const partner = new Partner({
      name: req.body.name,
      image: req.cloudinaryResult.secure_url,
      page_link: req.body.page_link,
    });

    await partner.save();

    return res.status(200).json({ msg: "Partner added successfully" });
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

exports.getPartners = async (req, res) => {
  try {
    return res.status(200).json(res.paginatedResults);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};

exports.updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findById({ _id: req.params.id });
    if (!partner) return res.status(404).json({ msg: "Not Found" });

    await Partner.updateOne({ _id: req.params.id }, req.body);
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

exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById({ _id: req.params.id });
    if (!partner) return res.status(404).json({ msg: "Not Found" });

    await Partner.deleteOne({ _id: req.params.id });
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

exports.getPartner = async (req, res) => {
  try {
    const partner = await Partner.findById({ _id: req.params.id });
    if (!partner) return res.status(404).json({ msg: "Not Found" });
    return res.status(200).json({ status: "success", data: partner });
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
