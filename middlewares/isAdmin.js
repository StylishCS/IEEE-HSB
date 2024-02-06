const jwt = require("jsonwebtoken");
const { Team } = require("../models/Team");

async function AdminPrivileges(req, res, next) {
  try {
    if (!req.header("Authorization")) {
      console.log("flag1")
      return res.status(401).json("FORBIDDEN");
    }
    const key = req.header("Authorization").split(" ")[0];
    const token = req.header("Authorization").split(" ")[1];
    if (key !== process.env.JWT_KEYWORD) {
      console.log("flag2");
      return res.status(401).json("FORBIDDEN");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Team.findById(decoded._id);
    if (!admin) {
      console.log("flag3");
      return res.status(401).json("FORBIDDEN");
    }
    if (admin.role !== "Chairman") {
      console.log("flag4");
      return res.status(401).json("FORBIDDEN");
    }
    req.adminId = decoded._id;
    next();
  } catch (error) {
    console.log("flag5");
    console.log(error);
    return res.status(401).json("FORBIDDEN");
  }
}

module.exports = AdminPrivileges;
