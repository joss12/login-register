const router = require('express').Router()
const authCont = require('../controllers/authControllers')

router.get('/', authCont.isLoggedIn, (req, res)=>{
    res.render('index', {
        user: req.user
    });
})

router.get('/register', (req, res)=>{
    res.render('register');
});

router.get('/login', (req, res)=>{
    res.render('login');
});

router.get('/skills', (req, res)=>{
    res.render('skills');
});

router.get('/about', (req, res)=>{
    res.render('about');
});

router.get('/profile', authCont.isLoggedIn, (req, res, next)=>{
    
    if(req.user){
        res.render('profile', {
            user: req.user
        });
    }else{
        res.redirect('/login')
    }
    res.render('profile');
     
});

module.exports  = router