const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userAuth = require("../middleware/user-auth");
const db = require("../models");

if (process.env.NODE_ENV !== 'production') require("dotenv").load();

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.send("App is running!");
    });

    app.post("/sign-up", function (req, res) {

        bcrypt.hash(req.body.password, 10, function (err, encrypted) {
            if (err) res.sendStatus(400);
            else {
                db.UserMod.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    email: req.body.email,
                    password: encrypted
                }).then(function (addedUser) {
                    res.json(addedUser);
                }).catch(function (err) {
                    res.send(err);
                });
            }
        });
    });

    app.delete("/delete-account/:id", function (req, res) {

    });

    app.post("/log-in", function (req, res) {

        db.UserMod.findOne({
            email: req.body.email
        }).then(function (userDB) {
            bcrypt.compare(req.body.password, userDB.password, function (err, same) {
                if (err) res.send(err);
                else if (same) {

                    jwt.sign({
                        email: userDB.email
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    }, function (err, token) {
                        if (err) res.send(err);
                        else {
                            res.send(token);
                        }
                    });

                } else res.send("Wrong password!"); // res.sendStatus(403);
            });
        }).catch(function (err) {
            res.send("Email not found!"); // res.sendStatus(403);
        });

    });

    // The route to be protected
    app.post("/api/posts", userAuth, function (req, res) {
        res.send("Post created...");
    });
};