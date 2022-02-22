const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter } = require('../config/mail.config');

const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const secretRefreshKey = process.env.SECRETE_REFRESH_KEY;

const prisma = require('../config/db');
const recoveryPinModel = prisma.recovery_pin;

//Controller
const userController = require('./users.controller');

//Functionalities
//Function to login user for mobile devices using email and password with jwt token and refresh token with response to client
const mobileLogin = async (req, res, next) => {
    try {
        const user = req.user;

        const payload = {
            userId: user.id,
            role: user.userRole
        }

        const accessToken = jwt.sign(payload, secretAccessKey, {expiresIn: '20m'});
        const refreshToken = jwt.sign(payload, secretRefreshKey, {expiresIn: '10d'});
        const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

        await userController.updateCustomer(user.id, {refreshToken: hashRefreshToken});

        delete user.password;
        delete user.refreshToken;

        res.status(200).json({
            user,
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error);
    }
}

//Function to generate new token with REFRESH TOKEN
const mobileRefreshToken = async (req, res, next) => {
    try {
        
        const id = parseInt(req.params.id);
        const sentRefreshToken = req.body.refreshToken;
        const user = await userController.findById(id);

        const dbRefreshToken = user.refreshToken;
        const isMatch = await bcrypt.compare(sentRefreshToken, dbRefreshToken);

        if (!isMatch) {
            throw boom.unauthorized();
        }

        const payload = {
            userId: user.id,
            role: user.userRole
        }

        const accessToken = jwt.sign(payload, secretAccessKey, {expiresIn: '20m'});
        const newRefreshToken = jwt.sign(payload, secretRefreshKey, {expiresIn: '10d'});
        const newHashRefreshToken = await bcrypt.hash(newRefreshToken, 10);

        await userController.updateCustomer(user.id, {refreshToken: newHashRefreshToken});

        res.status(200).json({
            accessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        next(error);
    }
}

//Function to get User and check if exists
const getUser = async (email, password) => {
    const user = await userController.findByEmail(email);
    
    if (!user) {
        throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw boom.unauthorized();
    }
    return user;
}

const emailPin = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userController.findByEmail(email);

        if (!user) {
            throw boom.notFound();
        }

        const pin = Math.floor(Math.random() * 999999 + 100000).toString();

        const recoveryPin = await recoveryPinModel.create({
            data: {
                userId: user.id,
                pin,
                createdAt: new Date(),
                expirationDate: new Date(new Date().getTime() + 5*60000)
            }
        });

        await transporter.sendMail({
            from: 'Interflora',
            to: user.email,
            subject: 'Interflora App - Pin de recuperación de contraseña',
            html: `
            <div style="font-family:Roboto,sans-serif; border:1px solid #838383;max-width:600px;width:90%;padding:.7rem;padding-bottom: 2rem;margin:.7rem auto;
            border-radius:1rem;box-shadow:0 2px 4px #aaa">
                <div style="text-align: center;">
                    <h1 style="font-style: italic;color:#bfa658;">INTERFLORA</h1>
                </div>
                <div style="text-align: center;">
                    <h2 style="margin:1rem 0; color:#333;font-size:2rem;">Oops!</h2>
                    <p style="margin:1rem 0; color:#666" >
                        Hola ${user.userName}, parece que has olvidado tu contraseña
                    </p>
                    <h3 style="margin:1rem 0; color:#333;font-size:2rem" class="content-title">Pin de recuperación</h3>
                    <p style="margin:1rem 0; letter-spacing:1rem;font-size:3rem;color:#bfa658;">${recoveryPin.pin}</p>
                    <p style="margin-top:1rem; margin:0;font-size:.8rem;color:#aaa" >Ingresa este pin en la aplicación para poder cambiar tu contraseña</p>
                    <p style="margin:0;font-size:.8rem;color:#aaa">Si no solicitaste el pin de recuperación puedes ignorar este mensaje</p>
                </div>
            </div>
            `
        });

        res.status(201).json({
            status: 'ok',
            msg: 'Pin de recuperación de contraseña enviado al correo'
        });


    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = { mobileLogin, mobileRefreshToken, getUser, emailPin };