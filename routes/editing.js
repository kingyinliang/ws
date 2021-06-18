const url = require('url')

let editingRoom = {}

module.exports = (socket, io) => {
    const query = url.parse(socket.request.url,true).query
    if (!editingRoom[query.editingId]) {
        editingRoom[query.editingId] = {
            userList: [],
            messageData: null
        }
    }
    if (!editingRoom[query.editingId].userList.length) {
        editingRoom[query.editingId].messageData = null
    }
    let userInfo = {}
    if (query.userId === '4f8ec92927c53af338') {
        userInfo = { id: '4f8ec92927c53af338', realName: '李浩' }
    } else if (query.userId === '480661063847747584') {
        userInfo = { id: '480661063847747584', realName: '谷宇' }
    } else {
        userInfo = { id: 'fd68f4b1ce6bb89d07', realName: '王银亮' }
    }

    // 在线用户列表添加用户
    if (!editingRoom[query.editingId].userList.find(item => item.id === userInfo.id)) {
        editingRoom[query.editingId].userList.push(userInfo)
        socket.join(query.editingId)
    }

    console.log(io.adapter.rooms)

    // 广播在线用户
    io.to(query.editingId).emit('user-list', editingRoom[query.editingId].userList)
    // 给当前用户当前编辑内容
    editingRoom[query.editingId].messageData? socket.emit('all-message', editingRoom[query.editingId].messageData) : ''

    // 接收更新内容
    socket.on('text-change', (delta) => {
        socket.broadcast.to(query.editingId).emit('text-change', delta)
    })

    // 接收全部内容
    socket.on('all-message', (message) => {
        editingRoom[query.editingId].messageData = message
    })

    // 接收位置信息
    socket.on('selection-change', (range) => {
        // 更新用户位置
        editingRoom[query.editingId].userList.find(item => item.id === query.userId).range = range
        // 广播出去自己的位置
        socket.broadcast.to(query.editingId).emit('selection-change', {
            id: query.userId,
            range
        })
    })

    // 关闭连接
    socket.on('disconnect', () => {
        // 在线用户列表移出用户
        editingRoom[query.editingId].userList = editingRoom[query.editingId].userList.filter(item => item.id !== query.userId)
        // socket.leave(query.userId)
        // 广播在线用户
        io.to(query.editingId).emit('user-list', editingRoom[query.editingId].userList)
    })
}
