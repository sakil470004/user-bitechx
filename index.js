const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// Use cors middleware to enable CORS
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request body
// for environment variable
require("dotenv").config();
const uri = `mongodb+srv://mynulsakil:${process.env.USER_PASS}@cluster0.bpciahf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   await client.connect();
    console.log("mongo Connected Successfully");
    const userCollection = client
      .db("user-bitechx")
      .collection("user");
    
    // get all users
    app.get("/allUsers", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    // user has username and password add new user
    app.post("/addUser", async (req, res) => {
      const user = req.body;
      // find user by username see if it exists!
      const query = { username: user.username };
      const currentUser = await userCollection.findOne(query);
      if (currentUser) {
        res.send({ status: "already exists" });
      } else {
        const result = await userCollection.insertOne(user);
        res.send(result);
      }
    });
    // change user password by username
    app.patch("/changePassword", async (req, res) => {
      const { username, password } = req.body;
      const query = { username: username };
      const updateDoc = { $set: { password: password } };
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    // delete user by username
    app.delete("/deleteUser/:username", async (req, res) => {
      const username = req.params.username;
      const query = { username: username };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // delete user by id
    app.delete("/deleteUserById/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  
  } finally {

  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From user bitechx server!");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
