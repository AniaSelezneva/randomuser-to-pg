require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();
const client = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

let pool;

const dbName = "users_db";

async function createDbAndTable() {
  try {
    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully`);
    } else {
      console.log(`Database "${dbName}" already exists`);
    }

    pool = new Pool({
      user: process.env.USER,
      host: process.env.HOST,
      database: dbName,
      password: process.env.PASSWORD,
      port: process.env.PORT,
    });

    await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        gender TEXT,
        name_title TEXT,
        name_first TEXT,
        name_last TEXT,
        location_street_number INTEGER,
        location_street_name TEXT,
        location_city TEXT,
        location_state TEXT,
        location_country TEXT,
        location_postcode TEXT,
        location_coordinates_latitude TEXT,
        location_coordinates_longitude TEXT,
        location_timezone_offset TEXT,
        location_timezone_description TEXT,
        email TEXT,
        login_uuid TEXT,
        login_username TEXT,
        login_password TEXT,
        login_salt TEXT,
        login_md5 TEXT,
        login_sha1 TEXT,
        login_sha256 TEXT,
        dob_date TIMESTAMP,
        dob_age INTEGER,
        registered_date TIMESTAMP,
        registered_age INTEGER,
        phone TEXT,
        cell TEXT,
        id_name TEXT,
        id_value TEXT,
        picture_large TEXT,
        picture_medium TEXT,
        picture_thumbnail TEXT,
        nat TEXT
      );`);
    console.log("Tables created successfully (if didn't exist)");
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

app.get("/", async (_, res) => {
  try {
    const response = await axios.get("https://randomuser.me/api/");
    const users = response.data.results;

    for (const user of users) {
      const {
        gender,
        name,
        location,
        login,
        dob,
        registered,
        phone,
        cell,
        id,
        picture,
        nat,
        email,
      } = user;
      const { title, first, last } = name;
      const { city, state, country, postcode, coordinates, timezone } =
        location;
      const { number, name: streetName } = location.street;
      const { latitude, longitude } = coordinates;
      const { uuid, username, password, salt, md5, sha1, sha256 } = login;
      const { date: dobDate, age: dobAge } = dob;
      const { date: registeredDate, age: registeredAge } = registered;
      const { name: idName, value: idValue } = id;
      const { large, medium, thumbnail } = picture;

      const query = `INSERT INTO users (
        gender,
        name_title,
        name_first,
        name_last,
        location_street_number,
        location_street_name,
        location_city,
        location_state,
        location_country,
        location_postcode,
        location_coordinates_latitude,
        location_coordinates_longitude,
        location_timezone_offset,
        location_timezone_description,
        email,
        login_uuid,
        login_username,
        login_password,
        login_salt,
        login_md5,
        login_sha1,
        login_sha256,
        dob_date,
        dob_age,
        registered_date,
        registered_age,
        phone,
        cell,
        id_name,
        id_value,
        picture_large,
        picture_medium,
        picture_thumbnail,
        nat
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34
      )
      RETURNING id
      `;

      const values = [
        gender || null,
        title || null,
        first || null,
        last || null,
        number || null,
        streetName || null,
        city || null,
        state || null,
        country || null,
        postcode || null,
        latitude || null,
        longitude || null,
        timezone?.offset || null,
        timezone?.description || null,
        email || null,
        uuid || null,
        username || null,
        password || null,
        salt || null,
        md5 || null,
        sha1 || null,
        sha256 || null,
        dobDate || null,
        dobAge || null,
        registeredDate || null,
        registeredAge || null,
        phone || null,
        cell || null,
        idName || null,
        idValue || null,
        large || null,
        medium || null,
        thumbnail || null,
        nat || null,
      ];
      await pool.query(query, values);
    }

    res.send(`${users.length} users have been created successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting users into database");
  }
});

(async () => {
  try {
    await createDbAndTable();
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  } catch (err) {
    console.error(err);
  }
})();
