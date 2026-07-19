import express from "express";
const router = express.Router();
import {
    dbCategories
} from "../database/categories-db.js";
import {
    v4 as uuidv4
} from "uuid";
router.use(express.json());
// =============================== CREATE CATEGORIES ========================================
router.post("/categories/add", (req, res) => {
    try {
        const {
            name
        } = req.body;
        // check duplicate data
        const currentCategory = dbCategories.find((c) => c.name === name)
        if (currentCategory) {
            return res.status(400).send("Duplicate data ...");
        }
        const newCategory = {
            _id: uuidv4(),
            name: name
        };
        dbCategories.push(newCategory);
        res.status(201).send(dbCategories);
    } catch (err) {
        return res.status(500).send(err);
    }
});
export default router;