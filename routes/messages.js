/** @format */
const express = require("express");
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new express.Router();

/**
 * GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 */

router.get("/:id", ensureCorrectUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await Message.get(id);
    return res.send({ message: response });
  } catch (e) {
    next(e);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureCorrectUser, async (req, res, next) => {
  try {
    //   NEED TO GET THE FROM_USERNAME FROM THE TOKEN!!!
    // const {from_username} = ?????
    const { to_username, body } = req.body;
    const response = await Message.create({ from_username, to_username, body });
    return res.send({ message: response });
  } catch (e) {
    next(e);
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await Message.markRead(id);
    return res.send({ message: response });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
