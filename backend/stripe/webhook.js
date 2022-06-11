const stripeAPI = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const QRCode = require('qrcode');


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


        if(session.metadata.idReinoire!=null)
        {
             try {
                await axios.post("http://localhost:3001/private/vanzariReinoire/"+session.metadata.idReinoire,{
                idTranzactie:session.id,
                dataStart: session.metadata.dataStart,
                dataStop: session.metadata.dataStop,
                idPayment : session.payment_intent,
                })
                navigate('/success');
            } catch (error) {
                console.log("Eroare: "+error);
            } 
        }
        else
        {
            let qr;
            if(session.metadata.tip==="nominal")
            {
                qr = await QRCode.toDataURL(session.metadata.cnp+""+Date.now() +""+ Math.floor(100000 + Math.random() * 900000));
            }
            else
            {
                qr = await QRCode.toDataURL(Math.floor(1000000000000 + Math.random() * 9000000000000)+""+Date.now() +""+ Math.floor(100000 + Math.random() * 900000));
            }

            await axios.post("http://localhost:3001/private/vanzariAdauga",{idTranzactie:session.id,
            numeBilet: sessionRetriveData.data[0].description,
            pret: session.amount_total/100,
            dataStart: session.metadata.dataStart,
            dataStop: session.metadata.dataStop,
            codQR : qr,
            user: session.customer_email,
            tip: session.metadata.tip,
            activ: session.metadata.activ,
            tipImagine : session.metadata.tipImagine,
            valabilitateTip : session.metadata.valabilitateTip,
            perioada : session.metadata.perioada,
            idPayment : session.payment_intent,
            tipBilet: session.metadata.tipBilet,
            cnp: session.metadata.cnp,
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
}