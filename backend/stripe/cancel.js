const stripeAPI = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.cancelPayment = async function(req,res){
    const {payment_intent} = req.body;
    try {
        await stripeAPI.refunds.create({payment_intent,}); 
        res.status(200).json({success:true});
    } catch (error) {
        res.status(400).json({error: 'an error occured, unable to cancel payment'});
    }

}