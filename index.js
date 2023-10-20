const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.send('Brand Shop server is running')
})

// Database 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nqsglt4.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database e brands field
    const brandCollection = client.db('brand-store').collection('brand-store-brands')

    // Get Brands Start
    app.get('/brands', async(req, res) => {
        const cursor = brandCollection.find()
        const result = await cursor.toArray()
        res.json(result)
    })
    // Get Brands End 


    // Get data for individual brand start
    app.get(`/brands/:id`, async(req, res) =>{
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await brandCollection.findOne(query)
        console.log(result);
        res.send(result)
    })
    // Get data for individual brand End

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Database End

app.listen(port, () => {
    console.log(`Brand Show is running ${port}`);
})

// 
// 