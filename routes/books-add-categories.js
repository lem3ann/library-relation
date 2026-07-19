import express from "express";
const router = express.Router();
import {
    dbBooksCategories
} from "../database/books-categories-db.js";
import {
    dbBooks
} from "../database/books-db.js";
import {
    dbCategories
} from "../database/categories-db.js";
import {
    v4 as uuidv4
} from "uuid";
router.use(express.json());
// const dbBooksCopy = dbBooks;
const dbBooksCategoriesCopy = dbBooksCategories;
// ====================================== CREATE RELATION ===============================================
router.post("/books/add", (req, res) => {
    try {
        const {
            categories,
            name
        } = req.body;
        const newBook = {
            _id: uuidv4(),
            name: name
        };
        dbBooks.push(newBook);
        // relation
        for (let i = 0; i < categories.length; i++) {
            const categoryName = categories[i];
            let currentCategory = (dbCategories.find((c) => c.name === categoryName));
            if (!currentCategory) {
                return res.status(400).send("Bad request ...");
            }
            const bookId = newBook._id;
            const categoryId = currentCategory._id;
            // PİVOT TABLE for category and book
            dbBooksCategories.push({
                _id: uuidv4(),
                bookId: bookId,
                categoryId: categoryId
            });
        }
        return res.status(201).send(dbBooks);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});
// ============================ GET BOOKS AND THEIR CATEGORIES ======================================
router.get("/books/getAll/:bookId", (req, res) => {
    try {
        const {
            bookId
        } = req.params;
        const selectedBook = dbBooks.find((b) => bookId === b._id);
        // console.log(selectedBookArr);
        if (!selectedBook) {
            return res.status(404).send("Not found !!");
        };
        // pivot table checking
        const filteredBook = dbBooksCategories.filter((b) => b.bookId === bookId);
        const categories = [];
        for (let i = 0; i < filteredBook.length; i++) {
            const currentCategoryId = filteredBook[i].categoryId;
            const currentCategoryName = dbCategories.find((c) => c._id === currentCategoryId).name;
            categories.push(currentCategoryName);
        };
        return res.send({
            bookName: selectedBook.name,
            categories: categories
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});
// ========================================================= GET CATEGORIES AND THEIR BOOKS ======================================
router.get("/categories/getAll/:categoryId", (req, res) => {
    try {
        const {
            categoryId
        } = req.params;
        const selectedCategory = dbCategories.find((c) => c._id === categoryId);
        if (!selectedCategory) {
            return res.status(404).send("Not found !!");
        };
        const filteredCategories = dbBooksCategories.filter((b) => b.categoryId === categoryId);
        const books = [];
        for (let i = 0; i < filteredCategories.length; i++) {
            const currentBookId = filteredCategories[i].bookId;
            const currentBookName = dbBooks.find((b) => b._id === currentBookId).name;
            books.push(currentBookName);
        }
        return res.status(200).send({
            category: selectedCategory.name,
            books: books
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
})
export default router;