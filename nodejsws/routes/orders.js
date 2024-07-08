var express = require('express');
var router = express.Router();

const verify_token = require('../middleware/jwr_decode');

var orderSchema = require('../models/orders.model');
var { Response } = require('../config/response');

router.get('/', verify_token, async function(req, res, next) {
    try {
        let orders = await orderSchema.find();

        res.status(200).send(Response(200, 'this is all of orders', orders));
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

module.exports = router;