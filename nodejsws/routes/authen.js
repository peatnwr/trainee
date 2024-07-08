var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();

const verify_token = require('../middleware/jwr_decode');

var userSchema = require('../models/users.model');
var { Response } = require('../config/response');

router.post('/login', async function(req, res, next) {
    try {
        let { username, password } = req.body;
        let user_exist = await userSchema.exists({ username: username }) ? true : false;

        if (!username) { return res.status(400).send(Response(400, "username is required field")) }
        if (!password) { return res.status(400).send(Response(400, "password is required field")) }
        if (!user_exist) {
            res.status(400).send(Response(400, "this username isn't exist. please go to register first."));
        } else {
            let user_data = await userSchema.findOne({ username: username });

            if (user_data.is_approve === false) {
                res.status(400).send(Response(400, "waiting for approve from admin."));
            } else {
                let compare = await bcrypt.compare(password, user_data.password);
                if (compare) {
                    const token = await jwt.sign(
                        {
                            _id: user_data._id,
                            name: user_data.name,
                            position: user_data.is_admin
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                    res.status(200).send(Response(200, "login_success",
                        {
                            _id: user_data._id,
                            name: user_data.name,
                            token: token
                        }
                    ));
                } else {
                    res.status(400).send(Response(400, "password is not correct."));
                }
            }
        }
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

router.post('/register', async function(req, res, next) {
    try {
        let { username, password, name, is_admin, is_approve } = req.body;

        if (!username) { return res.status(400).send(Response(400, "username is required field")) }
        if (!password) { return res.status(400).send(Response(400, "password is required field")) }
        if (!name) { name = `Anonymous [${username}]` }
        if (!is_admin) { is_admin = false }
        if (!is_approve) { is_approve = false }

        let hash_pw = await bcrypt.hash(password, 10);
        let reg_user = await userSchema.create({ username: username, password: hash_pw,  name: name, is_admin: is_admin, is_approve: is_approve});

        res.status(200).send(Response(200, "register_success", reg_user));
        
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

router.put('/approve/:id', verify_token, async function(req, res, next) {
    try {
        let { id } = req.params;
        let position = req.position;

        if (position === "admin") {
            let user_data = await userSchema.findOne({ _id: id });
            if (user_data.is_approve === false) {
                let approve_user = await userSchema.findByIdAndUpdate(id, { is_approve: true });
                res.status(200).send(Response(200, "the user has now been approved.", approve_user));
            } else {
                return res.status(400).send(Response(400, "this user has previously been approved", user_data));
            }
        } else {
            return res.status(400).send(Response(400, "you don't have permission to approve."))
        }
    } catch (err) {
        res.status(400).send(Response(400, err.message));
    }
});

module.exports = router;