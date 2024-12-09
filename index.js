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



const { MongoClient, ServerApiVersion } = require('mongodb');
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
    

    ////crud/////

    const deepCollection = client.db('deepDB').collection('deepData')
   

    app.get('/deepData',  async(req, res) => {
     
        const cursor = deepCollection.find() 
        const result = await cursor.toArray()
        res.send(result)

    })


    ////crud/////



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