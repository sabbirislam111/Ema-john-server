const express = require('express');
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const { parse } = require('dotenv');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000



// middle ware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8ntp6ce.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    const productsCollection = client.db("emaJohn").collection("products");
    
    app.get('/products', async (req, res) =>{
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size)
        // console.log(page, size);
        const query = {};
        const cursor = productsCollection.find(query);
        const products = await cursor.skip(page*size).limit(size).toArray();
        const count = await productsCollection.estimatedDocumentCount();
        res.send({count, products})
    })

    app.post('/productsById', async (req, res) =>{
        const ids = req.body
        console.log("my ids",ids)
        const objectIds = ids.map(id=> new ObjectId(id))
        const query = {_id: {$in: objectIds}}
        // const query = {}
        const cursor = productsCollection.find(query)
        const products = await cursor.toArray();

        res.send(products)
    })


   
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('ema-john server is running')
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})