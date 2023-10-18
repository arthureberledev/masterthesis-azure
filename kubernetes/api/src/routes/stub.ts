import { Router } from "express";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const users = [
      {
        id: 1,
        name: "Test User",
        email: "test@email.com",
      },
      {
        id: 2,
        name: "Test User",
        email: "test@email.com",
      },
      {
        id: 3,
        name: "Test User",
        email: "test@email.com",
      },
      {
        id: 4,
        name: "Test User",
        email: "test@email.com",
      },
      {
        id: 5,
        name: "Test User",
        email: "test@email.com",
      },
    ];
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
    const user = {
      id: Math.floor(Math.random() * 1000) + 1,
      name: "Test User",
      email: "test@email.com",
    };
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
    const id = Math.floor(Math.random() * 1000) + 1;
    res.status(201).json({ id, ...req.body });
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
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
});

export default router;
