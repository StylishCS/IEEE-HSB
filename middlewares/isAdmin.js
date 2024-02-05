const jwt = require("jsonwebtoken");
const { Team } = require("../models/Team");

async function AdminPrivileges(req, res, next) {
  try {
    if (!req.header("Authorization")) {
      return res.status(401).json("FORBIDDEN");
    }
    const key = req.header("Authorization").split(" ")[0];
    const token = req.header("Authorization").split(" ")[1];
    if (key !== process.env.JWT_KEYWORD) {
      return res.status(401).json("FORBIDDEN");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Team.findById(decoded._id);
    if (!admin) {
      return res.status(401).json("FORBIDDEN");
    }
    if (admin.role !== "Chairman") {
      return res.status(401).json("FORBIDDEN");
    }
    req.adminId = decoded._id;
    next();
  } catch (error) {
    return res.status(401).json("FORBIDDEN");
  }
}

module.exports = AdminPrivileges;
