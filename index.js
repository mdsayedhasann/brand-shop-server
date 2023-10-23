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

    // Database e Products er Collection create
    const productCollection = client.db('brand-store').collection('brand-store-products')

    // 1.  Get Brands Start
    app.get('/brands', async(req, res) => {
        const cursor = brandCollection.find()
        const result = await cursor.toArray()
        res.json(result)
    })
    // 1.  Get Brands End 


    // 2. Get data for individual brand start
    app.get(`/brands/:id`, async(req, res) =>{
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await brandCollection.findOne(query)
        console.log(result);
        res.send(result)
    })
    // 2. Get data for individual brand End

    // 3. Add New Products In Database Start
    app.post(`/products`, async(req, res) => {
        const newProduct = req.body
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct)
        res.send(result)
    })
    // 3. Add New Products In Database End

    // 4. Showing Added Products to the Database Start
    app.get('/products', async(req,res) => {
        const cursor = productCollection.find({})
        const result = await cursor.toArray()
        res.send(result)
    })
    // 4. Showing Added Products to the Database End

    //  5. Show Single Product Data Start
    app.get(`/product/:id`, async(req, res) => {
        console.log('result');
        const id = req.params.id
        const query = { _id: new ObjectId(id)}
        const result = await productCollection.findOne(query)
        res.json(result)
    })
    //  5. Show Single Product Data End

    // 6.  Delete a product Start
    app.delete('/product/:id', async(req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id)}
        const result = await productCollection.deleteOne(query)
        res.json(result)
    })
    // 6.  Delete a product End

    // 7.   Update Get Start
    app.get('/product/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.findOne(query)
        res.send(result)
    })
    // 7.   Update Get End


    // 8    Update Put Start
    app.put('/product/:id', async(req, res) => {
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const options = {
            upsert: true
        }
        const updateProduct = req.body 
        const product = {
            $set: {
                name: updateProduct.name,
                typeDropsown: updateProduct.typeDropsown,
                shortDescription: updateProduct.shortDescription,
                price: updateProduct.price,
                photo: updateProduct.photo,
            }
        }
        const result = await productCollection.updateOne(filter, product, options)
        console.log(result);
        res.send(result)
    }) 
    // 8    Update Put End 


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