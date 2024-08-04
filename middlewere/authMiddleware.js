const jwt = require('jsonwebtoken');
const User = require('../models/User')

const requireauth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if token exists
    if (token) {
        jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

//check current user
const checkUser = async (req,res,next)=>{
    const token = req.cookies.jwt;

    // Check if token exists
    if (token) {
        jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
                res.locals.user = null
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next();
            }
        });
    } else {
        res.locals.user = null
        next()
    }
}
module.exports = { requireauth,checkUser };
