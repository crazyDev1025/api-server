const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const { MongoClient } = require("mongodb");
const url = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_USER_PASSWORD}@jdaycluster.yulmi.mongodb.net`;
const main = async () => {
  var corsOptions = {
    origin: "*",
  };

  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const client = new MongoClient(url);
  await client.connect();
  console.log("Connected to Mongodb");

  /////////// Router ///////////
  var router = require("express").Router();

  router.get("/", async (req, res) => {
    const cursor = client.db("JDayCluster").collection("funds").find();
    const result = await cursor.toArray();
    res.send(result);
  });

  router.get("/:address", async (req, res) => {
    const address = req.params.address;
    const result = await client
      .db("JDayCluster")
      .collection("funds")
      .findOne({ address: address });
    res.send(result);
  });

  router.post("/account", async (req, res) => {
    const address = req.body.address;
    const result = await client
      .db("JDayCluster")
      .collection("funds")
      .findOne({ address: address });
    res.send(result);
  });

  router.post("/", async (req, res) => {
    const result = await client
      .db("JDayCluster")
      .collection("funds")
      .insertOne(req.body);
    res.send(result);
  });

  router.post("/addfund", async (req, res) => {
    console.log(req.body);
    const result = await client
      .db("JDayCluster")
      .collection("funds")
      .updateOne(
        { address: req.body.address },
        { $set: { funds: req.body.funds } }
      );
    res.send(result);
  });

  app.use("/api/funds", router);
};

main().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}.`);
  });
});