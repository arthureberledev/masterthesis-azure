import { Router } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { getDbPool } from "../services/db";

const router = Router();
const db = getDbPool();

// const conn = new mysql.createConnection(config);

// router.get("/", async (_req, res) => {
//   // try {
//   conn.connect((err) => {
//     if (err) {
//       console.log("!!! Cannot connect !!! Error:");
//       throw err;
//     } else {
//       console.log("Connection established.");
//       conn.query("SELECT * FROM users", (err, rows, fields) => {
//         if (err) throw err;
//         for (const row of rows) {
//           console.log(`${row.name} is in ${row.email}`);
//         }

//         res.status(200).json(rows);

//         conn.end((err) => {
//           if (err) throw err;
//           console.log("Connection closed.");
//         });
//       });
//     }
//   });

//   // const [rows] = await db.query("SELECT * FROM users");
//   // const users = rows || [];
//   // } catch (error) {
//   //   console.log(error);
//   //   res.status(500).json({
//   //     message: error instanceof Error ? error.message : "Internal Server Error",
//   //   });
//   // }
// });

router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    const users = rows || [];
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const [rows] = (await db.query("SELECT * FROM users WHERE id = ?", [
      id,
    ])) as RowDataPacket[];

    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const [results] = (await db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    )) as ResultSetHeader[];

    res.status(201).json({ id: results.insertId, ...req.body });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;
    if (!id || !email) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const [results] = (await db.query(
      "UPDATE users SET email = ? WHERE id = ?",
      [email, id]
    )) as ResultSetHeader[];

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.status(200).json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Bad Request" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
});

export default router;
