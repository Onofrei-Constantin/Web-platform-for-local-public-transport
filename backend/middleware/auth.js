const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");


exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }


  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
      jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err)
        {
          return res.status(403).json("Token is not valid!")
        }

        req.user = user;
        next();
      })


  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this router", 401));
  }
};

exports.protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }


  try {
     
    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err)
        {
          return res.status(403).json("Token is not valid!")
        }

        if(user.pozitie===false)
        {
          return res.status(401).json("Nu esti autorizat!")
        }

        req.user = user;
        next();
         
      })

    

  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this router", 401));
  }
};





