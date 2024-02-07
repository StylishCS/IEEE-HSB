const { Videos } = require("../models/videos");

exports.addVideo = async (req, res) => {
  try {
    let video = new Videos({
      body: req.body.body,
      season: req.body.season,
      tag: req.body.tag
    });
    await video.save();
    return res.status(200).json({ msg: "Video added successfully" });
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

exports.getVideos = async (req, res) => {
  try {
    const videos = await Videos.find();
    if (!videos) return res.status(404).json({ msg: "No Videos Found" });

    return res.status(200).json({ status: "success", data: videos });
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

exports.updateVideo = async (req, res) => {
  try {
    const video = await Videos.findById({ _id: req.params.id });
    if (!video) return res.status(404).json({ msg: "Not Found" });

    await Videos.updateOne({ _id: req.params.id }, req.body);
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

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Videos.findById({ _id: req.params.id });
    if (!video) return res.status(404).json({ msg: "Not Found" });

    await Videos.deleteOne({ _id: req.params.id });
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

exports.getVideo = async (req, res) => {
  try {
    const video = await Videos.findById({ _id: req.params.id });
    if (!video) return res.status(404).json({ msg: "Not Found" });
    return res.status(200).json({ status: "success", data: video });
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
