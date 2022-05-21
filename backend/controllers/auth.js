const User = require('../models/user.model')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require("jsonwebtoken");
let refreshTokens = [];

exports.refresh = (req,res)=>{
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).json("You are not authenticated!");
    if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
    }
    jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET,(err,user)=>{
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = getSignedToken(user);
        const newRefreshToken = getRefreshToken(user);

        refreshTokens.push(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    })
}


exports.register = async(req,res,next) =>{
    const {email,parola,nume,prenume,telefon,adresa} = req.body;
    const pozitie = false;

    try {
        const user = await User.create({
            email,parola,nume,prenume,telefon,adresa,pozitie
        });

        sendToken(user,201,res);
    } catch (error) {
       next(error);
    }
};

exports.registerAdmin = async(req,res,next) =>{
    const {email,parola,nume,prenume,telefon,adresa} = req.body;
    const pozitie = true;

    try {
        await User.create({
            email,parola,nume,prenume,telefon,adresa,pozitie
        });
    } catch (error) {
       next(error);
    }
};

exports.login = async(req,res,next) =>{
    const {email,parola} = req.body;

    if(!email||!parola)
    {
        return next(new ErrorResponse("Introdu email si paroala!"),400);
    }


    try {
        const user = await User.findOne({
            email
        }).select("+parola");

        if(!user){
            return next(new ErrorResponse("Invalid email sau parola!"),401);
        }

        const isMatch = await user.matchParole(parola);

        if(!isMatch)
        {
            return next(new ErrorResponse("Invalid email sau parola!"),401);
        }

        sendToken(user,200,res);

    } catch (error) {
        next(error);
    }
};


exports.logout = (req,res)=>{
    const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter((token)=>token!==refreshToken)
    res.status(200).json("Logout cu succes!")
}


const sendToken = (user,statusCode,res) =>
{
    const accessToken = getSignedToken(user);
    const refreshToken = getRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.status(statusCode).json({
        sucess:true,email:user.email,pozitie:user.pozitie,accessToken,refreshToken,
    });
};


const getSignedToken =(user) =>{
    return jwt.sign({id: user._id, email:user.email, pozitie:user.pozitie}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRE})
}

const getRefreshToken =(user)=>{
    return jwt.sign({id: user._id, email:user.email, pozitie:user.pozitie}, process.env.JWT_REFRESH_SECRET)
}