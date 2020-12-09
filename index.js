const path = require('path');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');

//const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

//load env vars
dotenv.config({ path: './config/config.env' });

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// connect to database
connectDB();

const auth = require('./routes/auth');
const post = require('./routes/post');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File Uploading
app.use(fileupload());

//set Static folder
app.use(express.static(path.join(__dirname, 'public')));

//mount routers
app.use('/api/auth', auth);
app.use('/api', post);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, console.log(`Server is running on port ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
})