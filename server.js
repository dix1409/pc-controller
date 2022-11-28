const app = require("./app")
const http = require("http")
const robot = require("robotjs")
const os = require("os")

const handleSocketEvents = require("./socket")

const port = normalizePort(process.env.PORT || "4000")
app.set("port", port)
const server = http.createServer(app)
server.listen(port, "0.0.0.0", () => {
    console.log("server start")
})
server.on("error", onError)
server.on("listening", onListening)

const io = require("socket.io")(server)

io.on("connection", (socket) => {
    handleSocketEvents(socket, robot)
    console.log("Someone connected")
})

const iFaces = os.networkInterfaces()

function normalizePort(val) {
    var port = parseInt(val, 10)
    if (isNaN(port)) {
        return val
    }

    if (port >= 0) {
        return port
    }
    return false
}

function onError(error) {
    if (error.syscall !== "listen") {
        throw error
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges")
            process.exit(1)
            break
        case "EADDRINUSE":
            console.error(bind + " is already in use")
            process.exit(1)
            break
        default:
            throw error
    }
}

function onListening() {
    console.log("server listning started")
    // console.log(iFaces)
    Object.keys(iFaces).forEach((iFace) => {
        iFaces[iFace].forEach((Face) => {
            // console.log(Face)
            if (!Face.internal && Face.family === "IPv4")
                console.log(
                    `Can access on your network with this http://${Face.address}:${port}`
                )
        })
    })
}
