const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');

require('./config/passport.config');
const indexRouter = require('./routes/');

const app = express();
const upload = multer({ dest: '/app/uploads' })

app.use(logger('dev'));
app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: '*'
}));

app.use('/api', indexRouter);

//Error handling middlewares
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.use('*', function(req, res){
    res.status(404).json({status: 'failed', msg: "Doesn't exists"});
});

module.exports = app;
