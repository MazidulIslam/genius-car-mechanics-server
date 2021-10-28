const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nu4vl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    // GET API

    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //   GET Single Services

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("hitting specific id", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    //   POST API
    app.post("/services", async (req, res) => {
      const services = req.body;
      console.log("hit the post api", services);
      //   const service = {
      //     name: "ENGINE DIAGNOSTIC",
      //     price: "300",
      //     description:
      //       "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
      //   };
      const result = await servicesCollection.insertOne(services);
      //   console.log(result);
      res.json(result);
    });

    //   DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    // console.log("connected to db");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running genius server");
});

app.listen(port, () => {
  console.log("running genius server on port ", port);
});
