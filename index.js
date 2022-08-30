const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mktyzg7.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const itemsCollection = client.db('street-smartz').collection('items');

        // create item
        app.post('/inventory', async (req, res)=>{
          const addItem = req.body;
          const result = await itemsCollection.insertOne(addItem);
          res.send(result);
      });

        // get item
        app.get('/inventory',async(req,res)=>{
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        // get single item
        app.get('/inventory/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await itemsCollection.findOne(query);
          res.send(result);
      });

      // update item
      app.put('/inventory/:id', async(req, res) =>{
        const id = req.params.id;
        const updateItem = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true};
        const updateDoc = {
            $set: {
              name: updateItem.name,
              img: updateItem.img,
              details: updateItem.details,
              price: updateItem.price,
              quantity: updateItem.quantity,
              supplier: updateItem.supplier,
              brand: updateItem.brand,
              mileage: updateItem.mileage
            }
        };
        const result = await itemsCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    });

    // delete item
    app.delete('/inventory/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });

    // item collection api
    app.get('/my-inventory/', async(req, res)=>{
      const email = req.query.email;
      const query = {email: email};
      const cursor = itemsCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from backend')
})

app.listen(port, () => {
  console.log(`Street smartz listening on port ${port}`)
})