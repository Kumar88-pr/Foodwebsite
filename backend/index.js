//iampramodkumar8888
//iF0Yev4b1rbrLGaQ
//2:25
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//mongodb config

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { parse } = require("dotenv");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-foodi-cluster.mqm1312.mongodb.net/?retryWrites=true&w=majority&appName=demo-foodi-cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    //dabase and collection
    const menuCollection = client.db("demo-foodi-client").collection("menus");
    const cartCollection = client
      .db("demo-foodi-client")
      .collection("cartItems");

    //all menu items operations
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    //all cart operations

    //posting cart to db
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    //get carts using email
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const filter = { email: email };
      const result = await cartCollection.find(filter).toArray();
      res.send(result);
    });

    //get specific carts
    app.get("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await cartCollection.findOne(filter);
      res.send(result);
    });

    //delete item from carts
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(filter);
      res.send(result);
    });

    //update cart quantity using + and - button
    app.put("/carts/:id",async(req,res)=>{
      const id = req.params.id; //This line gets the id parameter from the URL and assigns it to the id variable.
      const { quantity } = req.body; //This line extracts the quantity property from the request body and assigns it to the quantity variable.
      const filter = { _id: new ObjectId(id) }; //This line creates a filter object that will be used to identify the document to be updated in the database.
      const options = { upsert: true }; //This line creates an options object with the upsert property set to true. This option tells the database to insert a new document if no document matches the filter.

      const updateDoc = {
        $set: {
          quantity: parseInt(quantity, 10),
        },
      };
      const result = await cartCollection.updateOne(filter, updateDoc, options);
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`xample app listening on port ${port}`);
});
