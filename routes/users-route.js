import express from "express";
const router = express.Router();
import { dbUsers } from "../database/users-db.js";
import { dbOrders } from "../database/orders-db.js";
import { dbBooks } from "../database/books-db.js";
import { v4 as uuidv4 } from "uuid";
// ================================= CREATE NEW USER ===============================================
router.post("/users/add", (req, res) => {
  try {
    const { name, balance } = req.body;
    const newUser = {
      _id: uuidv4(),
      name: name,
      balance: balance,
    };
    if (!balance) {
      return res.status(404).send("Bad request:Balance is required");
    }
    if (balance < 0) {
      return res.status(404).send("Balance must be positive number ..");
    }
    dbUsers.push(newUser);
    return res.status(201).send(dbUsers);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});
// ================================ OREDERS -RELATION ==============================================
router.post("/orders/add", (req, res) => {
  try {
    const { username, books } = req.body;
    const currentUser = dbUsers.find((u) => u.name === username);
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
        bookId: currentBookId,
        return: false,
      };
      dbOrders.push(newOrder);
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
//  =======================   GET ALL USER AND THEIR BOOKS DATA =============================
// router.get("/users/get-all-data", (req, res) => {
//   try {
//     const currentObj = [];
//     const currentOrders = [];
//     for (let i = 0; i < dbUsers.length; i++) {
//       const filteredOrder = dbOrders.filter((o) => o.userId === dbUsers[i]._id);
//       for (let j = 0; j < filteredOrder.length; j++) {
//         const filterBook = dbBooks.find(
//           (b) => b._id === filteredOrder[j].bookId,
//         );
//         currentOrders.push(filterBook.name);
//       }
//       currentObj.push(dbUsers[i].name);
//       currentObj.push(currentOrders);
//     }
//     return res.status(200).send(currentObj);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send(err);
//   }
// });
export default router;
