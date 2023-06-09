const CustomErrorRepository = require("../DAO/repository/error.repository");

function adminAccess(req, res, next) {
  if (req.user.role === "administrador") {
    next();
  } else {
    next(new CustomErrorRepository(401));
  }
}

module.exports = adminAccess;
