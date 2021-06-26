const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5050;

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello World");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cbpdo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
    const blogsCollection = client.db("retro-tech-blog").collection("blogs");
  
    app.get("/blogs", (req, res) => {
        blogsCollection.find().toArray((err, documents) => {
        res.send(documents);
      });
    });
  
    app.get("/blog/:id", (req, res) => {
        blogsCollection
        .find({ _id: ObjectId(`${req.params.id}`) })
        .toArray((err, documents) => {
          res.send(documents[0]);
        });
    });
  
    app.post("/addBlog", (req, res) => {
      const newBlog = req.body;
      blogsCollection.insertOne(newBlog).then((result) => {
        res.send(result.insertedCount > 0);
      });
    });
  
    app.delete("/delete/:id", (req, res) => {
        blogsCollection
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then((result) => {
          res.send(result.deletedCount > 0);
        });
    });
  });

app.listen(port);

