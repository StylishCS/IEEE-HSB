const { Slogan } = require("../models/Slogan");

exports.addSlogan = async (req, res) => {
  try {
    let slogan = new Slogan({
      body: req.body.body,
      season: req.body.season,
    });
    await slogan.save();
    return res.status(200).json({ msg: "Slogan added successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};

exports.getSlogans = async (req, res) => {
  try {
    const solgans = await Slogan.find();
    if (!solgans) return res.status(404).json({ msg: "No Slogans Found" });

    return res.status(200).json({ status: "success", data: solgans });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};

exports.updateSlogan = async (req, res) => {
  try {
    const slogan = await Slogan.findById({ _id: req.params.id });
    if (!slogan) return res.status(404).json({ msg: "Not Found" });

    await Slogan.updateOne({ _id: req.params.id }, req.body);
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

exports.deleteSlogan = async (req, res) => {
  try {
    const slogan = await Slogan.findById({ _id: req.params.id });
    if (!slogan) return res.status(404).json({ msg: "Not Found" });

    await Slogan.deleteOne({ _id: req.params.id });
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

exports.getSlogan = async (req, res) => {
  try {
    const slogan = await Slogan.findById({ _id: req.params.id });
    if (!slogan) return res.status(404).json({ msg: "Not Found" });
    return res.status(200).json({ status: "success", data: slogan });
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
