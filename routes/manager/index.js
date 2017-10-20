const router = require('express').Router();
const fieldboost = require('./fieldboost');

router.use('/fieldboost', fieldboost);

module.exports = router;