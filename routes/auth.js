const router = require('express').Router()
const authCont = require('../controllers/authControllers')

router.post('/register', authCont.register);
router.post('/login', authCont.login);
router.get('/logout', authCont.logout);



module.exports  = router