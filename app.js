var createError = require("http-errors")
var express = require("express")
var path = require("path")

// middelware imports
var logger = require("morgan")

var app = express()
app.use(logger("dev"))
app.use(express.json())

app.use(express.static(path.join(__dirname, "build")))

app.get("/", function (req, res, next) {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.use(function (req, res, next) {
    next(createError(404))
})

app.use(function (err, req, res, next) {
    res.locals.message = err.message
    res.status(err.status || 500)
})

module.exports = app
