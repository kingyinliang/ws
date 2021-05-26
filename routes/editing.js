const url = require('url')

let messageData = null
let userList = []

module.exports = (socket, io) => {
    if (!userList.length) {
        messageData = null
    }
    const query = url.parse(socket.request.url,true).query
    let userInfo = {}
    if (query.userId === '4f8ec92927c53af338') {
        userInfo = { id: '4f8ec92927c53af338', realName: '李浩' }
    } else if (query.userId === '480661063847747584') {
        userInfo = { id: '480661063847747584', realName: '谷宇' }
    } else {
        userInfo = { id: 'fd68f4b1ce6bb89d07', realName: '王银亮' }
    }

    // 在线用户列表添加用户
    userList.push(userInfo)
    socket.join(query.userId)

    // 广播在线用户
    io.emit('user-list', userList)
    // 给当前用户当前编辑内容
    messageData? socket.emit('all-message', messageData) : ''

    // 接收更新内容
    socket.on('text-change', (delta) => {
        socket.broadcast.emit('text-change', delta)
    })

    // 接收全部内容
    socket.on('all-message', (message) => {
        messageData = message
    })

    // 接收位置信息
    socket.on('selection-change', (range) => {
        // 更新用户位置
        userList.find(item => item.id === query.userId).range = range
        // 广播出去自己的位置
        socket.broadcast.emit('selection-change', {
            id: query.userId,
            range
        })
    })

    // 关闭连接
    socket.on('disconnect', () => {
        // 在线用户列表移出用户
        userList = userList.filter(item => item.id !== query.userId)
        socket.leave(query.userId)
        // 广播在线用户
        io.emit('user-list', userList)
    })
}
