const url = require('url')
const socketIo = require('socket.io')
const editing = require('./routes/editing')
const inspection = require('./routes/inspection')

module.exports = (server) => {
    const io = socketIo(server, {
        cors: true
    })
    const editingRoom = io.of('editing').on('connection', (socket) => editing(socket, editingRoom))
    const inspectionRoom = io.of('inspection').on('connection', (socket) => inspection(socket, inspectionRoom))
}
