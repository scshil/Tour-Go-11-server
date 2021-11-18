const express = require("express");
const cors = require("cors");
const Objectid = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const port = process.env.PORT || 7000;
// middleware
app.use(cors());
app.use(express.json());
//
app.get("/", (req, res) => {
  res.send("hi api");
});
// connection
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1mcl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//
async function run() {
  try {
    await client.connect();
    const database = client.db("travel");
    const serviceCollection = database.collection("services");
    const winterOfferCollection = database.collection("winter");
    const orderCollection = database.collection("orders");
    //   get data from database
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //-----------send data from ui-----------
    app.post("/addservice", async (req, res) => {
      const service = req.body;
      const postResult = await serviceCollection.insertOne(service);
      res.json(postResult);
      // console.log(postResult);
    });
    // get single product
    app.get("/services/:id", async (req, res) => {
      // console.log(req.params.id);
      const singleresult = await serviceCollection
        .find({ _id: Objectid(req.params.id) })
        .toArray();
      res.send(singleresult[0]);
    });
    // ordered producr
    app.post("/purchesitem", async (req, res) => {
      const order = req.body;
      const postorder = await orderCollection.insertOne(order);
      // console.log(postorder);
      res.json(postorder);
    });
    // all orders
    app.get("/purchesitem", async (req, res) => {
      const order = req.body;
      const postorder = await orderCollection.find({}).toArray();
      // console.log(postorder);
      res.json(postorder);
    });
    // getting product using email
    app.get("/purchesitem/:email", async (req, res) => {
      const cursor = orderCollection.find({ email: req.params.email });
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete
    app.delete("/delete/:id", async (req, res) => {
      const result = await orderCollection.deleteOne({
        _id: Objectid(req.params.id),
      });
      res.send(result);
    });
    /* winter service */
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
//
app.listen(port, () => {
  console.log("connected! in ", port);
});
/* 
https://pure-crag-33813.herokuapp.com/
 */
