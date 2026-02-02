const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const auth = require("../middleware/auth");


router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});


router.post("/", auth, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        error: "Name and price are required"
      });
    }

    const newItem = new Item({ name, price, description });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/:id", auth, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        error: "Name and price are required"
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});


router.patch("/:id", auth, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

module.exports = router;
