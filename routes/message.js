const express = require("express");
const router = express.Router();
const message_controller = require("../controllers/messageController")

// Required controller modules.

/* GET newMessage Page. */
router.get('/', message_controller.message_form_get);
/* POST newMessage Page. */
router.post('/', message_controller.message_form_post);
/* GET delete Message Page. */
router.get('/:id/delete', message_controller.message_delete_get);
/* POST delete Message Page. */
router.post('/:id/delete', message_controller.message_delete_post);
module.exports = router;