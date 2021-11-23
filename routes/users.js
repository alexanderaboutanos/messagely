/** @format */
const express = require("express");
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new express.Router();

/**
 * GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 */

router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const response = await User.all();
    return res.send({ users: response });
  } catch (e) {
    next(e);
  }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    const response = await User.get(username);
    return res.send({ user: response });
  } catch (e) {
    next(e);
  }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/to", ensureCorrectUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    const response = await User.messagesTo(username);
    return res.send({ messages: response });
  } catch (e) {
    next(e);
  }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/from", ensureCorrectUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    const response = await User.messagesFrom(username);
    return res.send({ messages: response });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
