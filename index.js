const express = require('express');
const cors = require('cors');
const port=process.env.PORT || 5000;
require('dotenv').config();
const app=express();


// 



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://caruser:<password>@cluster0.imw9t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('running my server')
})

app.listen(port,()=>{
    console.log('listening to port');
})