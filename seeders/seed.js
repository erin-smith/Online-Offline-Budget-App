const mongoose = require("mongoose");
const db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true
});

const transactionSeed = [
  {
    name: "Payday",
    value: 1000
  },
  {
    name: "Internet",
    value: -60
  },
  {
    name: "Electric",
    value: -74
  },
  {
    name: "Groceries",
    value: -188,
    date: new Date(Date.now())
  }
];

db.Transaction.deleteMany({})
  .then(() => db.Transaction.collection.insertMany(transactionSeed))
  .then(data => {
    console.log(data.result.n + " transactions inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
