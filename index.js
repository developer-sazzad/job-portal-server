require('dotenv').config()
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware 
app.use(cors())
app.use(express.json())


// MongoDb server
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ea9k8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const jobsCollection = client.db('JobPortal').collection('jobs');
        const jobApplicationCollection = client.db('JobPortal').collection('jobApplications')

        app.get('/jobs', async(req, res) => {
            const find = jobsCollection.find();
            const result = await find.toArray();
            res.send(result)
        })

        app.get('/jobs/:id', async(req, res) => {
            const id = req.params.id;
            const queary = { _id: new ObjectId(id)};
            const result = await jobsCollection.findOne(queary)
            res.send(result);
        })

        // Job Applications api
        app.post('/job-applications', async(req, res) => {
            const application = req.body;
            const result = await jobApplicationCollection.insertOne(application);
            res.send(result);
        })
        

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Job Portal Server is Running...............')
})

app.listen(port, (req, res) => {
    console.log(`Job Portal server port is : ${port}`)
})