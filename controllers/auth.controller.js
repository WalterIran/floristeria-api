const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const secretRefreshKey = process.env.SECRETE_REFRESH_KEY;

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

module.exports = { mobileLogin, mobileRefreshToken, getUser };