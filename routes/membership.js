var express = require('express');
var router = express.Router();

// Required controller modules.
const membership_controller = require("../controllers/membershipController.js")

router.get("/become-secret-member", membership_controller.become_secret_member_get);
router.post("/become-secret-member", membership_controller.become_secret_member_post);

router.get("/become-admin", membership_controller.become_admin_get);
router.post("/become-admin", membership_controller.become_admin_post)

module.exports = router;
