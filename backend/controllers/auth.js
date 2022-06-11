const User = require('../models/user.model')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require("jsonwebtoken");
const axios = require('axios');


exports.refresh = async (req,res)=>{
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).json("You are not authenticated!");
    
    const dataToken = await axios.post('http://localhost:3001/public/resetTokenList',{token:refreshToken}).catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
        });
    

    
    if (!dataToken) {
        return res.status(403).json("Refresh token is not valid!");
    }

    jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET,async (err,user)=>{
        err && console.log(err);

        const id = dataToken.data._id;

        try {
            await axios.post('http://localhost:3001/public/deleteResetTokenList/'+id);
        } catch (error) {
            console.log("Eroare la 3!");
            return res.status(400).json("Eroare la 3!")
        }

        const newAccessToken = getSignedToken(user);
        const newRefreshToken = getRefreshToken(user);

        try {
            await axios.post('http://localhost:3001/public/addResetTokenList',{token:newRefreshToken});
        } catch (error) {
            console.log("Eroare la 4!");
            return res.status(400).json("Eroare la 4!")
        }

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    })
}


exports.register = async(req,res,next) =>{
    const {email,cnp,parola,nume,prenume,telefon,adresa} = req.body;
    const pozitie = false;

    try {
        const user = await User.create({
            email,cnp,parola,nume,prenume,telefon,adresa,pozitie
        });

        sendToken(user,201,res);
    } catch (error) {
       next(error);
    }
};

exports.registerAdmin = async(req,res,next) =>{
    const {email,cnp,parola,nume,prenume,telefon,adresa} = req.body;
    const pozitie = true;

    try {
        await User.create({
            email,cnp,parola,nume,prenume,telefon,adresa,pozitie
        });

        res.status(201).json({sucess:true});
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


exports.logout = async (req,res)=>{
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).json("You are not authenticated!");

    const dataToken = await axios.post('http://localhost:3001/public/resetTokenList',{token: refreshToken}).catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
        });

    if (!dataToken) {
        return res.status(403).json("Refresh token is not valid!");
    }

    const id = dataToken.data._id;

    try {
        await axios.post('http://localhost:3001/public/deleteResetTokenList/'+id);
    } catch (error) {
        console.log("Eroare la 6!");
        return res.status(400).json("Eroare la 6!")
    }
    res.status(200).json("Logout cu succes!")
}


const sendToken = async (user,statusCode,res) =>
{
    const accessToken = getSignedToken(user);
    const refreshToken = getRefreshToken(user);
    
    try {
        await axios.post('http://localhost:3001/public/addResetTokenList',{token:refreshToken})
    }catch (error) {
        console.log("Eroare la 1!");
        return res.status(400).json("Eroare la 1!")
    }

    res.status(statusCode).json({
        sucess:true,email:user.email,cnp:user.cnp,pozitie:user.pozitie,accessToken,refreshToken,
    });
};


const getSignedToken =(user) =>{
    return jwt.sign({id: user._id, email:user.email, pozitie:user.pozitie}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRE})
}

const getRefreshToken =(user)=>{
    return jwt.sign({id: user._id, email:user.email, pozitie:user.pozitie}, process.env.JWT_REFRESH_SECRET)
}