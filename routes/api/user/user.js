const router = require("express").Router();
const userControlller = require("../../../controllers/userController");

router
    .route("/")
    .get((req, res, next) => res.send("App is running!"));

router
    .route("/sign-up")
    .post(userControlller.createAndSignIn);

router
    .route("/sign-in")
    .post(userControlller.signIn);

module.exports = router;
