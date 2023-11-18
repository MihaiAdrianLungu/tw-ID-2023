const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const app = express();
const path = require('path');

const User = require('./database/models/User');
const Order = require('./database/models/Order');

User.hasMany(Order, {foreignKey: 'userId'});

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRoutes);

app.get('/', function (req, res) {
  console.log('Hello World!');
  res.status(200).json({msg: 'Hello World!'})
})

app.listen(8080, function() {
    console.log('Server listening on port: ' + 8080)
})