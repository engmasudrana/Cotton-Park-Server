const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbld0.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("cottonPark").collection("products");
    const orderCollection = client.db("cottonPark").collection("orders");

    // add new product
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
            res.send(result.insertedCount)
        })
    })

    // all products API
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // single product API
    app.get('/product/:id', (req, res) => {
        productsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // checkout order
    app.post('/checkoutOrder', (req, res) => {
        const details = req.body
        orderCollection.insertOne(details)
        .then(result => console.log(result))
    })

    // order list API
    app.get('/order', (req, res) => {
        const email = req.query.email
        orderCollection.find({ email: email })
            .toArray((err, documents) => {
            res.send(documents)
        })
    })

    // delete product
    app.delete('/delete/:id', (req, res) => {
        productsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
            res.send(result.deletedCount > 0)
        })
    })
});

app.get('/', (req, res) => {
    res.send('Server Working...')
})
app.listen(process.env.PORT || port);
