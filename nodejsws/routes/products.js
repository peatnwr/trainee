var express = require('express');
var router = express.Router();

const verify_token = require('../middleware/jwr_decode');

var productSchema = require('../models/products.model');
var orderSchema = require('../models/orders.model');
var { Response } = require('../config/response');

router.get('/', verify_token, async function(req, res, next) {
    try {
        let products = await productSchema.find();

        res.status(200).send(Response(200, "get all products.", products));
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

router.get('/:id', verify_token, async function(req, res, next) {
    try {
        let { id } = req.params;

        let product = await productSchema.findById(id);

        res.status(200).send(Response(200, "get product", product));
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

router.post('/', verify_token, async function(req, res, next) {
    try {
        let { name, price, detail, stock } = req.body;
        let position = req.position;

        if (position === "admin") {
            if (!name) { return res.status(400).send(Response(400, "name is required field")) }
            if (!price) { price = 50 }
            if (!detail) { detail = "" }
            if (!stock) { stock = 100 }

            let add_product = await productSchema.create({ name: name, price: price, detail: detail, stock: stock });

            res.status(200).send(Response(200, "successfully add product.", add_product));
        } else {
            res.status(400).send(Response(400, "you don't have permission to add product."));
        }
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

router.put('/:id', verify_token, async function(req, res, next) {
    try {
        let { id } = req.params;
        let { price, detail, stock } = req.body;
        let position = req.position;

        if (position === "admin") {
            if (!id) { return res.status(400).send(Response(400, "you forgot sent id to this api.")) }
            if (!price) { price = 50 }
            if (!detail) { detail = "" }
            if (!stock) { stock = 100 }

            let edit_product = await productSchema.findByIdAndUpdate(id, { price, detail, stock });

            res.status(200).send(Response(200, "successfully edit product.", edit_product));
        } else {
            res.status(400).send(Response(400, "you don't have permission to edit product."));
        }
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

router.delete('/:id', verify_token, async function(req, res, next) {
    try {
        let { id } = req.params;
        let position = req.position;

        if (position === "admin") {
            if (!id) { return res.status(400).send(Response(400, "you forgot sent id to this api.")) }

            let delete_product = await productSchema.findByIdAndDelete(id);

            res.status(200).send(Response(200, "successfully delete product.", delete_product));
        } else {
            res.status(400).send(Response(400, "you don't have permission to delete product."));
        }
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

router.get('/:id/orders', verify_token, async function(req, res, next) {
    try {
        let { id } = req.params;
        let orders = await orderSchema.find({ product_id: id });

        res.status(200).send(Response(200, `all orders of this product`, orders));
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

router.post('/:id/orders', verify_token, async function(req, res, next) {
    try {
        let { id } = req.params;
        let { amount } = req.body;
        let name = req.name;

        if (!id) { return res.status(400).send(Response(400, "you forgot sent id to this api.")) }
        if (!amount) { amount = 1 }

        let product = await productSchema.findById(id);
        if (product.stock === 0) {
            res.status(400).send(Response(400, "this product out of stock."));
        } else {
            let create_order = await orderSchema.create({
                product_id: id,
                product_name: product.name,
                amount: amount,
                bought_by: name
            });
            await productSchema.findByIdAndUpdate(id, { stock: (product.stock - amount) });

            res.status(200).send(Response(200, "successfully to create order.", create_order));
        }
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

module.exports = router;