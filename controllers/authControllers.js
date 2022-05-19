const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


exports.register = async (req, res) =>{
    const {name, email, password, passwordConfirm} =  await req.body;


    db.query('SELECT email from USERS where email = ?', [email], async (err, results)=>{
        if(err){
            console.log(err);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'That email has been taken'
            })
        }else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Password do not match'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        db.query('INSERT INTO users SET ?', {name: name, email: email, password:hashedPassword },
        (err, results)=>{
            if(err){
                console.log(err)
            }else{
                return res.render('register', {
                    message: 'User registered'
                })  
            }
        })
    });

}

exports.login = async (req, res) =>{
    try {

        const {email, password } = req.body;

        if(!email || !password){

            return res.status(400).render('login', {
                message:'Please provide an email and password'
            })
        }
        
        db.query('SELECT * FROM users WHERE email = ?', [email], async (req, results)=>{
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login', {
                    message: 'The email or the password is incorrect'
                })
            }else{
                const id = await results[0].id;

                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log('Token' + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 *1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");

            }
        })
        
    } catch (error) {
        conbsole.log(error);
        return res.status(500).json(error)
    }
}


exports.isLoggedIn = async (req, res, next) =>{
    // console.log(req.cookies)
    if(req.cookies.jwt){
        try {

            //1) verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            
            //2) check if the user still exist
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id],
            (err, result)=>{
                console.log(result);
                if(!result){
                    return next();
                }

                req.user = result[0];
                return next();
            })
        } catch (error) {
            return next()
        }
        
    }else{

        next();
    }

}


exports.logout = async (req, res) =>{

    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    res.status(200).redirect('/');
}
