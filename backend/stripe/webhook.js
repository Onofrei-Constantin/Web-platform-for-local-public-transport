const stripeAPI = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

exports.webhook =  async function(req,res) {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripeAPI.webhooks.constructEvent(req['rawBody'],sig,process.env.WEB_HOOK_SECRET);
    } catch (error) {
        return res.status(400).send(`Webhook error ${error.message}`)
    }

    if(event.type === 'checkout.session.completed')
    {
        const session = event.data.object;

        const sessionRetriveData = await stripeAPI.checkout.sessions.listLineItems(
            session.id
        );

            let qr;
            if(session.metadata.tip==="nominal")
            {
                qr =session.metadata.cnp+""+Date.now() +""+ Math.floor(10000000000000 + Math.random() * 90000000000000);
            }
            else
            {
                qr = Math.floor(1000000000000 + Math.random() * 9000000000000)+""+Date.now() +""+ Math.floor(10000000000000 + Math.random() * 90000000000000);
            }

            await axios.post("http://localhost:3001/private/vanzariAdauga",{idSesiune:session.id,
            numeBilet: sessionRetriveData.data[0].description,
            pret: session.amount_total/100,
            dataStart: session.metadata.dataStart,
            dataStop: session.metadata.dataStop,
            user: session.customer_email,
            nominal: session.metadata.nominal,
            activ: session.metadata.activ,
            tip : session.metadata.tip,
            valabilitateTip : session.metadata.valabilitateTip,
            perioada : session.metadata.perioada,
            idPayment : session.payment_intent,
            tipPersoana: session.metadata.tipPersoana,
            cnp: session.metadata.cnp,
            idBilet:session.metadata.idBilet,
            pretReinoire:session.amount_total/100,
            codQrDecodat:qr,
            })
            .catch(function (error) {
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
        
    }
}