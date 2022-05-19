const express = require('express');
const corn = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
require('dotenv').config();
const errorHandler = require('./middleware/error');

const app = express();

app.use(corn());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


const uri = process.env.REACT_APP_TPL_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongoDB database connection established successgully");
})


const anunturiRouter = require('./routes/anunturi');
const bileteRouter = require('./routes/bilete');
const ruteRouter = require('./routes/rute');
const userRouter = require('./routes/user');

app.use('/anunturi', anunturiRouter);
app.use('/bilete', bileteRouter);
app.use('/rute', ruteRouter);
app.use('/user', userRouter);
app.use('/auth', require('./routes/auth'));

app.use(errorHandler);

const port = process.env.PORT || 3001;

const server = app.listen(port, ()=> {
    console.log(`Server is running on port: ${port}`);
});

process.on("unhandledRejection",(err,promise)=>{
    console.log(`Logged Error: ${err}`);
    server.close(()=>process.exit(1));
})