const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port =  process.env.PORT || 5000


console.log(process.env.DB_DEEPUSER)
console.log(process.env.DB_DEEPPASS)

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Deep Sea!')
})

/////////////////////////////////////////



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_DEEPUSER}:${process.env.DB_DEEPPASS}@cluster0.ruz4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    

    ////deepSea Data/////

    const deepCollection = client.db('deepDB').collection('deepData')
   

    app.get('/deepData',  async(req, res) => {
     
        const cursor = deepCollection.find() 
        const result = await cursor.toArray()
        res.send(result)

    })

    ////deepSea Data/////


    ////crud////

    const seaCollection = client.db('seaDB').collection('seaData')
    app.post('/seaData',  async(req, res) => {
       
      const seaData = req.body 
      console.log(seaData)
      const result = await seaCollection.insertOne(seaData)
      res.send(result)
      
    })

    app.get('/seaData', async(req, res) =>{
       
      const cursor = seaCollection.find()
      const result = await cursor.toArray();
      res.send(result)
   
    }) 

    app.delete('/seaData/:id', async(req, res) =>{

      const id = req.params.id 
      const query = { _id: new ObjectId(id) }
      const result = await seaCollection.deleteOne(query)
      res.send(result)

    }) 


    /////update system/////////
    
    app.get('/seaData/:id', async(req, res) =>{
    const id = req.params.id 
    const query = { _id: new ObjectId(id) }
    const result = await seaCollection.findOne(query)
    res.send(result)}) 
  
    app.put('/seaData/:id', async(req, res) => {
    const id = req.params.id 
    const upUsr = req.body 
    console.log(id, upUsr)
    const filter = { _id: new ObjectId(id) }
    const option = { upsert: true }
    const updateUser = req.body
    const upz = {
    $set: {
    image: updateUser.image,
    price: updateUser.price,
    name: updateUser.name}}
    const result = await seaCollection.updateOne(filter, upz, option)
    res.send(result)}) 
  
    ////crud////



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);



/////////////////////////////////////////

app.listen(port, () => {
  console.log(`Deep Sea port ${port}`)
})