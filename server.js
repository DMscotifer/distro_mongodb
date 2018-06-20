const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(parser.urlencoded({extended: true}));

const MongoClient = require("mongodb").MongoClient
const ObjectID = require("mongodb").ObjectID;

MongoClient.connect("mongodb://localhost:27017", function(err, client) {
  if (err) {
    console.log(err);
    return;
  }
  const db = client.db("distro_database");
  console.log("Connected to database!!");

  server.post("/api/distros", function(req, res, next){
    const distrosCollection = db.collection("distros");
    const distrosToSave = req.body;
    distrosCollection.save(distrosToSave, function(err, result){
      if (err) next(err)
      res.status(201);
      res.json(result.ops[0])
      console.log("saved to database!!");
    })
  });

  server.get("/api/distros", function(req, res){
    const distrosCollection = db.collection("distros");
    distrosCollection.find().toArray(function(err, allQuotes) {
      if (err) next(err);
      res.status(201);
      res.json(allQuotes);
    })
  })

  server.delete("/api/distros", function(req, res, next) {
    const distrosCollection = db.collection("distros");
    distrosCollection.remove({}, function(err, result) {
      if (err) next(err);
        res.status(201).json(result.ops);
    });
  })


  const next = function(){
    console.log(err);
    res.status(500).send();
  }

  server.post("/api/distros/:id", function(req, res, next) {
    const distrosCollection = db.collection("distros");
    const objectID = ObjectID(req.params.id);
    distrosCollection.update({_id: objectID}, req.body, function(err, result) {
        if (err) next (err);
        res.status(201).send();
    })
  })

  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });

})
