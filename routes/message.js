const express = require("express");
const router = express.Router();
const message_controller = require("../controllers/messageController")

// Required controller modules.

/* GET newMessage Page. */
router.get('/', message_controller.message_form_get);
/* GET newMessage Page. */
router.post('/', message_controller.message_form_post);

module.exports = router;