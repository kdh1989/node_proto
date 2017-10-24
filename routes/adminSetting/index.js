const router = require('express').Router();
//const account = require('./account');
//const accountAuth = require('./accountAuth');
const authMenu = require('./authMenu');
const menu = require('./menu');
const auth = require('./auth');

//router.use('/account', account);
//router.use('/accountAuth', accountAuth);
router.use('/authMenu', authMenu);
router.use('/menu', menu);
router.use('/auth', auth);

module.exports = router;