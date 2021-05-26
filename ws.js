const url = require('url')
const socketIo = require('socket.io')
const editing = require('./routes/editing')

module.exports = (server) => {
    const io = socketIo(server, {
        cors: true
    })
    const editingRoom = io.of('editing').on('connection', (socket) => editing(socket, editingRoom))
}
