const url = require('url')

const cacheData = []

module.exports = (socket, io) => {
    const query = url.parse(socket.request.url,true).query

    let inspectionId = [] // 检验组

    // 开始录入
    socket.on('start-inspection', (data) =>{
        inspectionId = data
        if (cacheData.find(it => it.inspectionId.join('') === data.join(''))) {
            // 移出该用户
            cacheData.find(it => it.inspectionId.join('') === inspectionId.join(''))
                .userList = cacheData.find(it => it.inspectionId.join('') === inspectionId.join(''))
                .userList.filter(item => item !== query.userName)
            // 添加该用户到用户列表
            cacheData.find(it => it.inspectionId.join('') === data.join('')).userList.push(query.userName)
            // 返回现有数据
            socket.emit('form-change', cacheData.find(it => it.inspectionId.join('') === data.join('')).formData)
            socket.emit('user-list', cacheData.find(it => it.inspectionId.join('') === data.join('')).userList)
        } else {
            cacheData.push({
                inspectionId: inspectionId,
                formData: {},
                userList: [query.userName]
            })
        }
        socket.join(inspectionId.join(','))
    })

    // 表单变化广播给该检验组的人
    socket.on('form-change', (data) =>{
        cacheData.find(it => it.inspectionId.join('') === inspectionId.join('')).formData = data;
        socket.broadcast.to(inspectionId.join(',')).emit('form-change', data)
    })

    // 关闭连接
    socket.on('disconnect', () => {
        // 在线用户列表移出用户
        cacheData.find(it => it.inspectionId.join('') === inspectionId.join('')).userList = cacheData.find(it => it.inspectionId.join('') === inspectionId.join('')).userList.filter(item => item !== query.userName)
        if (cacheData.find(it => it.inspectionId.join('') === inspectionId.join('')).userList.length === 0) {
            const index = cacheData.findIndex(it => it.inspectionId.join('') === inspectionId.join(''))
            cacheData.splice(index, 1)
            socket.leave(inspectionId.join(','))
        } else {
            // 广播在线用户
            io.to(inspectionId.join(',')).emit('user-list', cacheData.find(it => it.inspectionId.join('') === inspectionId.join('')).userList)
        }
    })
}
