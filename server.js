// Server setup
const express = require('express')
const app = express()
const api = require('./server/routes/api')
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Mongoose setup
const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/expenseDB").catch((err)=> console.log(err))

app.use('/', api)

const port = 4200
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})