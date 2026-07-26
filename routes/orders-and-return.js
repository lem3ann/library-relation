import express from "express";
const router = express.Router();
import {
  dbUsers
} from "../database/users-db.js";
import {
  dbOrders
} from "../database/orders-db.js";
import {
  dbBooks
} from "../database/books-db.js";
import {
  v4 as uuidv4
} from "uuid";

// ===================================== ORDERS -RELATION ====================================================
router.post("/orders/add/:userId", (req, res) => {
  try {
    const {
      books
    } = req.body;
    const {
      userId
    } = req.params;

    const currentUser = dbUsers.find((u) => u._id === userId);
    if (!currentUser) {
      return res.status(404).send("User Not Found !");
    }

    const foundBooks = [];
    for (let i = 0; i < books.length; i++) {
      const currentBook = dbBooks.find((b) => b.name === books[i]);
      if (!currentBook) {
        return res.status(404).send(`Book not found !`);
      }
      const foundedBook = currentBook.name;
      foundBooks.push(foundedBook);
    }

    const isExistingUser = dbOrders.find((o) => o.userId === userId);

    if (!isExistingUser) {
      currentUser.balance = currentUser.balance - 10;
      console.log("Balance -10 AZN");
    } else {
      console.log("Existing User ....");
    }

    const newOrder = {
      _id: uuidv4(),
      userId: currentUser._id,
      bookList: foundBooks,
      returnStatus: false
    };

    dbOrders.push(newOrder);
    return res.status(201).send(newOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});
// ==================================== Assigned books to User ==================================
router.get("/users/:userId", (req, res) => {
  try {
    const {
      userId
    } = req.params;
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
// =============================================== ORDERS RETURN ==================================================
router.put("/orders/return/:orderId", (req, res) => {
  try {
    const {
      orderId
    } = req.params;
    const {
      bookList
    } = req.body;
    const foundOrder = dbOrders.find((o) => o._id === orderId);
    if (!foundOrder) {
      return res.status(404).send("Order not found !")
    };
    // match
    const booklistOfOrder = foundOrder.bookList;
    if (!foundOrder.returnStatus) {
      if (bookList.length !== booklistOfOrder.length) {
        return res.status(200).send("The deposit will not be refunded.");
      } else {
        const copyBookList = JSON.stringify([...bookList].sort());
        const copyBookListOfOrder = JSON.stringify([...booklistOfOrder].sort());
        // console.log(copyBookList);
        // console.log(copyBookListOfOrder);
        if (copyBookList === copyBookListOfOrder) {
          const currentUser = dbUsers.find((u) => u._id === foundOrder.userId);
          currentUser.balance = currentUser.balance + 10;
          foundOrder.returnStatus = true;
          return res.send({
            message: `Success :+10 ~ Your Balance:${currentUser.balance} +AZN`
          });
        } else {
          foundOrder.returnStatus = true;
          return res.send("The deposit will not be refunded.")
        }
      }
    } else {
      return res.send("Already returned");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

export default router;