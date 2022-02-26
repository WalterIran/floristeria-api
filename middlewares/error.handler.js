const { Prisma } = require('@prisma/client');
const boom = require('@hapi/boom');

//Middleware to log errors in console
function logErrors (err, req, res, next) {
  console.log(err);
  next(err);
}

//Middleware to send errors to client
function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

//Middleware to handle boom errors
function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {

    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }else{
    next(err);
  }
}

//Middleware to handle Prisma ORM errors
function ormErrorHandler(err, req, res, next) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.meta.cause
    });
  }else{
    next(err);
  }
}


module.exports = { logErrors, errorHandler, boomErrorHandler, ormErrorHandler }
