const express = require("express");
const cors = require("cors");
const app = express();
const Port = 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const corsOptions = {
    origin: ['http://localhost:5173', 'https://furniflex-49b63.web.app'],
    credentials: true, 
  };

app.use(express.json());
app.use(cors(corsOptions));



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t87ip2a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
      const productCollection = client.db("furniflex").collection("products");
      const cartCollection = client.db("furniflex").collection("cart");
      app.get('/products', async(req, res)=>{
          const data = productCollection.find()
          const result = await data.toArray()
          res.send(result)
      })


      app.post('/cart', async(req,res)=>{
        const data = req.body
        const result = await cartCollection.insertOne(data)
        res.send(result)
      })

      app.get('/cart', async(req,res)=>{
        const email =req.query.email;
        const query = {email : email}
        const cartData = cartCollection.find(query)
        const result = await cartData.toArray()
        res.send(result)
      })

      app.delete('/cart/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await cartCollection.deleteOne(query)
        res.send(result)
      })



      app.put('/cart/:id', async (req, res) => {
        const id = req.params.id;
        const { quantity } = req.body;
        const query = { _id: new ObjectId(id) };
        const update = {
            $set: { quantity: quantity }
        };
        const result = await cartCollection.updateOne(query, update);
        res.send(result);
    });


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });


    


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
    res.send({ message: "Welcome to our server" });
});

app.listen(Port, () => {
    console.log(`Server is running at ${Port}`);
});