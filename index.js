const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000;
require('dotenv').config();
const app=express();

app.use(cors());
app.use(express.json());
// 

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.DB_ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pac0a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const carCollection=client.db('carhouse').collection('carcollection');
        const orderCollection = client.db('carhouse').collection('cars');

        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.DB_ACCESS_TOKEN, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })

        app.get('/car',async(req,res)=>{
            const query={};
            const cursor=carCollection.find(query);
            const cars=await cursor.toArray();
            res.send(cars);
        });
        

        app.get('/car/:id',async(req,res)=>{
            const id=req.params.id;
            console.log(id)
            const query={ _id:ObjectId(id)};
            const car=await carCollection.findOne(query);
            res.send(car);
        });


        app.post('/car',async(req,res)=>{
            const newCar=req.body;
            // console.log(newCar)
            const result=await carCollection.insertOne(newCar);
            res.send(result);
        });
        
        app.delete('/car/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const result=await carCollection.delete(query);
            res.send(result);
        });


        //order
        // app.get('/order',verifyJWT, async (req, res) => {
        //     const decodedEmail = req.decoded.email;
        //     console.log(decodedEmail)
        //     const email = req.query.email;
        //     console.log(email)
        //     if (email === decodedEmail) {
        //         const query = { email: email };
        //         const cursor = orderCollection.find(query);
        //         const orders = await cursor.toArray();
        //         res.send(orders);
        //     }
        //     else{
        //         res.status(403).send({message: 'forbidden access'})
        //     }
        // })
        app.get('/order',async(req,res)=>{
            const email = req.query.email;
            const query={email: email};
            const cursor=orderCollection.find(query);
            const orders=await cursor.toArray();
            res.send(orders);
        })

        app.post('/order',async(req,res)=>{
            const order=req.body;
            console.log(order);
            const result=await orderCollection.insertOne(order);
            res.send(result);
        })

    }
    finally{

    }
}

run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('running my server')
})

app.listen(port,()=>{
    console.log('listening to port');
})