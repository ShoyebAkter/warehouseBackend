const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000;
require('dotenv').config();
const app=express();


// 



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://caruser:<password>@cluster0.imw9t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const carCollection=client.db('carwarehouse').collection('car');

        app.get('/service',async(req,res)=>{
            const query={};
            const cursor=carCollection.find(query);
            const cars=await cursor.toArray();
            res.send(cars);
        });

        app.get('car/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const car=await carCollection.findOne(query);
            res.send(car);
        });

        

        

    }
    finally{

    }
}


app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('running my server')
})

app.listen(port,()=>{
    console.log('listening to port');
})