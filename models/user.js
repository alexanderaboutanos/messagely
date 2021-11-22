/**
 * User class for message.ly
 *
 * @format
 */

const db = require("../db");
const ExpressError = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");
const bcrypt = require("bcrypt");

/** User of the site. */

class User {
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (
          username,
          password,
          first_name,
          last_name,
          phone,
          join_at,
          last_login_at)
        VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
        RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]
    );
    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const results = await db.query(
      `SELECT username, password 
       FROM users
       WHERE username = $1`,
      [username]
    );
    const user = results.rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      return true;
    } else {
      return false;
    }
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users
         SET last_login_at = current_timestamp
         WHERE username = $1
         RETURNING username`,
      [username]
    );
    if (!result.rows[0]) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }
    return result.rows[0];
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query(`
    SELECT username, first_name, last_name, phone FROM users`);
    if (!results) {
      throw new ExpressError("There are no users in the database!", 404);
    }
    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const results = await db.query(
      `SELECT 
        username,
        first_name,
        last_name,
        phone,
        join_at,
        last_login_at
       FROM users
       WHERE username = $1`,
      [username]
    );
    if (!results) {
      throw new ExpressError("No user found!", 404);
    }
    return results.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const results = await db.query(
      `SELECT 
          m.id,
          m.body,
          m.sent_at,
          m.read_at,
          m.from_username,
          u.username AS to_user_username,
          u.first_name AS to_user_first_name,
          u.last_name AS to_user_last_name, 
          u.phone AS to_user_phone
        FROM messages AS m
          JOIN users AS u ON m.to_username = u.username
        WHERE m.from_username = $1`,
      [username]
    );
    if (!results) {
      throw new ExpressError(`No messages from ${username}!`, 404);
    }
    const messages = results.rows.map((m) => {
      return {
        id: m.id,
        to_user: {
          username: m.to_user_username,
          first_name: m.to_user_first_name,
          last_name: m.to_user_last_name,
          phone: m.to_user_phone,
        },
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at,
      };
    });
    return messages;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const results = await db.query(
      `SELECT 
          m.id,
          m.body,
          m.sent_at,
          m.read_at,
          m.from_username,
          u.username AS from_user_username,
          u.first_name AS from_user_first_name,
          u.last_name AS from_user_last_name, 
          u.phone AS from_user_phone
        FROM messages AS m
          JOIN users AS u ON m.from_username = u.username
        WHERE m.to_username = $1`,
      [username]
    );
    if (!results) {
      throw new ExpressError(`No messages to ${username}!`, 404);
    }
    const messages = results.rows.map((m) => {
      return {
        id: m.id,
        from_user: {
          username: m.from_user_username,
          first_name: m.from_user_first_name,
          last_name: m.from_user_last_name,
          phone: m.from_user_phone,
        },
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at,
      };
    });
    return messages;
  }
}

module.exports = User;
