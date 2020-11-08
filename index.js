const express = require('express')
const path = require('path')
const router = express.Router();
const PORT = process.env.PORT || 5000 ;
const app = express();
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
app
  .use(express.static(path.join(__dirname, './')))
  .set('views', path.join(__dirname, './'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const uri = "mongodb+srv://admin:admin@realmcluster.dvyjd.mongodb.net/ghpage?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });

app.post('/counter', cors(), (req, res) => {
  MongoClient.connect(uri, (err, client) => {
    let collection = client.db("ghpage").collection("user_counter");
    var reqIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    collection.insertOne({date: new Date(), page:req.body.page, ip: reqIP})
    .then(result => {
      res.send("++");
    })
    .catch(error => console.error(error));
    client.close();
  });
})

app.get('/counter/:page', function (req, res) {
  MongoClient.connect(uri, (err, client) => {
    let collection = client.db("ghpage").collection("user_counter");
    var reqIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    collection.insertOne({date: new Date(), page:req.params.page , ip: reqIP})
    .then(result => {
      res.send("+1");
    })
    .catch(error => console.error(error));
    client.close();
  });
})

app.get('/counterimg/:page', function (req, res) {
  MongoClient.connect(uri, (err, client) => {
    let collection = client.db("ghpage").collection("user_counter");
    var reqIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    collection.insertOne({date: new Date(), page:req.params.page , ip: reqIP})
    .then(result => {
      res.sendFile(path.join(__dirname, './img.png'));
    })
    .catch(error => console.error(error));
    client.close();
  });

  res.sendFile('res/solo.png', { root : __dirname})
})
