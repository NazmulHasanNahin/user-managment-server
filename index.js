const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
require("dotenv").config();


// middleware 

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nahin.31g6pd7.mongodb.net/?retryWrites=true&w=majority&appName=nahin`;

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

        // code start here 

        const alluser = client.db("userDB").collection("users")

        // to get all data via get 
        app.get("/users", async (req, res) => {
            const cursor = alluser.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //update 

        app.get("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await alluser.findOne(query);
            res.send(result)
        })


        app.post("/users", async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await alluser.insertOne(newUser);
            res.send(result);
        })

        app.put("/users/:id",async(req,res)=>{
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)};
            const option = {upsert : true };
            const user = req.body
            const updateduser = {
                $set :{
                    name:user.name,
                    age:user.age,
                    yob:user.yob,
                    fathername:user.fathername,
                    name:user.mothername,

                }
            };
            const result = await alluser.updateOne(filter,updateduser,option)
            res.send(result);
        })

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await alluser.deleteOne(query);
            res.send(result);
        })












        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send(`user server running ${port} port`)
})


app.listen(port, () => {
    console.log(`coffe server is running on port: ${port}`);
})