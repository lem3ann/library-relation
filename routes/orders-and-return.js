import express from "express";
const router = express.Router();
import { dbUsers } from "../database/users-db.js";
import { dbOrders } from "../database/orders-db.js";
import { dbBooks } from "../database/books-db.js";
import { v4 as uuidv4 } from "uuid";

// ===================================== ORDERS -RELATION ====================================================
router.post("/orders/add/:userId", (req, res) => {
  try {
    const { books } = req.body;
    const { userId } = req.params;
    const currentUser = dbUsers.find((u) => u._id === userId);
    if (!currentUser) {
      return res.status(404).send("User Not Found !");
    }
    const checkDeposit = dbOrders.filter((o) => o.userId === userId);
    if (checkDeposit.length !== 0) {
      console.log("Existing User .... ");
      for (let i = 0; i < books.length; i++) {
        const currentBook = dbBooks.find((b) => b.name === books[i]);
        if (!currentBook) {
          return res.status(404).send("Not found !!!");
        }
        const currentUserId = currentUser._id;
        const currentBookId = currentBook._id;
        const newOrder = {
          _id: uuidv4(),
          userId: currentUserId,
          bookId: currentBook.name,
          return: false,
        };
        dbOrders.push(newOrder);
      }
      return res.status(201).send(dbOrders);
    } else {
      const currentBalance = currentUser.balance - 10;
      console.log(currentBalance);
      console.log("Balance -10 AZN ");
      for (let i = 0; i < books.length; i++) {
        const currentBook = dbBooks.find((b) => b.name === books[i]);
        if (!currentBook) {
          return res.status(404).send("Not found !!!");
        }
        const currentUserId = currentUser._id;
        // const currentBookId = currentBook._id;
        const newOrder = {
          _id: uuidv4(),
          userId: currentUserId,
          bookList: currentBook.name,
          return: false,
        };
        dbOrders.push(newOrder);
      }
      return res.status(201).send(dbOrders);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});
// ==================================== Assigned books to User ==================================
router.get("/users/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = dbUsers.find((u) => u._id === userId);
    if (!currentUser) {
      return res.status(401).send("Not found  !!!");
    }
    const filteredUser = dbOrders.filter((u) => u.userId === userId);
    // return res.status(200).send(filteredUser);
    const books = [];
    for (let i = 0; i < filteredUser.length; i++) {
      const currentBookId = filteredUser[i].bookId;
      // find the name
      const bookName = dbBooks.find((b) => b._id === currentBookId).name;
      books.push(bookName);
      return res.status(200).send({
        user: currentUser.name,
        orderedBooks: books,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});
// =============================================== ORDERS RETURN ============================================================
router.get("/orders/return/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { books } = req.body;
});

export default router;
