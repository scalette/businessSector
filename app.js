const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');


const AppError = require('./utils/appError');
const userRouter = require('./routs/userRoutes');

const app = express();

app.enable('trust proxy');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  });

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(xss());

app.use(cors());
app.options('*', cors());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });

  
app.use(compression());


app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
  });
  

module.exports = app;