const express = require("express");
const router = express.Router();

// Required controller modules.
const auth_controller = require("../controllers/authController.js")

router.get("/", auth_controller.login_form_get);
router.post("/", auth_controller.login_form_post)

module.exports = router;