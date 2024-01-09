const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    req.logout((err) => {
        if(err){
            next(err);
        } else res.redirect("/")
    })
})

module.exports = router;