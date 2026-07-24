import express from "express";
const router = express.Router();
import { dbCategories } from "../database/categories-db.js";
import { v4 as uuidv4 } from "uuid";
router.use(express.json());
// =============================== CREATE CATEGORIES ========================================
router.post("/categories/add", (req, res) => {
  try {
    const { name } = req.body;
    // check duplicate data
    const currentCategory = dbCategories.find((c) => c.name === name);
    if (currentCategory) {
      return res.status(400).send("Duplicate data ...");
    }
    const newCategory = {
      _id: uuidv4(),
      name: name,
    };
    dbCategories.push(newCategory);
    res.status(201).send(dbCategories);
  } catch (err) {
    return res.status(500).send(err);
  }
});
// ===============================================   GET ALL CATEGORIES   ==========================
router.get("/categories/getAll", (req, res) => {
  return res.status(200).send(dbCategories);
});
// ==============================================  GET A SPECIFIC CATEGORY   =====================
// router.get("/categories/get/:categoryId", (req, res) => {
//   const { categoryId } = req.params;
//   const currentCategory = dbCategories.find((c) => c._id === categoryId);
//   if (currentCategory) {
//     return res.status(404).send("Bad request");
//   }
//   return res.status(200).send(currentCategory);
// });
//  ==========================================  DELETE CATEGORIES ==============================
router.delete("/categories/delete/:categoryId", (req, res) => {
  try {
    const { categoryId } = req.params;
    const currentCategory = dbCategories.find((c) => c._id === categoryId);
    if (!currentCategory) {
      return res.status(404).send("Bad request");
    }
    let indexOfCategory = dbCategories.indexOf(currentCategory);
    dbCategories.splice(indexOfCategory, 1);
    return res
      .status(200)
      .send("Deleted Item:" + JSON.stringify(currentCategory.name));
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
// ================================================  EDIT CATEGORY ==============================
router.put("/categories/edit/:categoryId", (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const currentCategory = dbCategories.find((c) => c._id === categoryId);
    if (currentCategory) {
      currentCategory.name = name;
      return res.status(200).send("category updated");
    } else {
      return res.status(404).send("Not found !!!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});
export default router;
