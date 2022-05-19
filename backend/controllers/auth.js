const User = require('../models/user.model')
const ErrorResponse = require('../utils/errorResponse')

exports.register = async(req,res,next) =>{
    const {email,parola,nume,prenume,telefon,adresa} = req.body;
    const pozitie = 0;

    try {
        await User.create({
            email,parola,nume,prenume,telefon,adresa,pozitie
        });
    } catch (error) {
       next(error);
    }
};

exports.registerAdministrare = async(req,res,next) =>{
    const {email,parola,nume,prenume,telefon,adresa} = req.body;
    const pozitie = 1;

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


exports.loginAdministrator = async(req,res,next) =>{
    const {email,parola} = req.body;

    if(!email||!parola)
    {
        return next(new ErrorResponse("Introdu email si paroala!"),400);
    }


    try {
        const user = await User.findOne({
            email
        }).select("+parola").select("+pozitie");

        if(!user){
            return next(new ErrorResponse("Invalid email sau parola!"),401);
        }

        const isMatch = await user.matchParole(parola);

        if(!isMatch)
        {
            return next(new ErrorResponse("Invalid email sau parola!"),401);
        }

        const isAdministrator = user.matchPozitie();

        if(!isAdministrator)
        {
            return next(new ErrorResponse("Nu sunteti autorizat!"),401);
        }

        sendToken(user,200,res);

    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode,res) =>
{
    const token = user.getSignedToken();
    res.status(statusCode).json({
        sucess:true,token
    })
};