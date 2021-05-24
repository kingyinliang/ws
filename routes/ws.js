const router = require('koa-router')()

let wsUser = {}
let messageData = null

function getUser() {
    let user = []
    for(let key in wsUser){
        user.push({
            userId: wsUser[key].userId,
            userInfo: wsUser[key].userInfo,
            range: wsUser[key].range,
        })
    }
    return user
}

router.get('/ws', async (ctx, next) => {
    console.log(ctx.query.userId)
    let userInfo = {}

    if (ctx.query.userId === '4f8ec92927c53af338') {
        userInfo = { realName: '李浩' }
    } else if (ctx.query.userId === '480661063847747584') {
        userInfo = { realName: '谷宇' }
    } else {
        userInfo = { realName: '王银亮' }
    }

    wsUser[ctx.query.userId] = {
        userId: ctx.query.userId,
        userInfo,
        range: null,
        ctx
    }

    if (messageData) {
        ctx.websocket.send(JSON.stringify({ data: messageData }))
    }

    let user = getUser()
    for(let key in wsUser){
        wsUser[key].ctx.websocket.send(JSON.stringify({ user }))
    }

    ctx.websocket.on("message", (message) => {
        // console.log(message);
        const data = JSON.parse(message)

        if (data.data) {
            messageData = data.data
        }

        for(let key in wsUser){
            if (ctx === wsUser[key].ctx && data.range !== null) {
                wsUser[key].range = data.range
            }
        }

        let user = getUser()
        for(let key in wsUser){
            if (ctx === wsUser[key].ctx) continue;
            wsUser[key].ctx.websocket.send(JSON.stringify({
                user,
                message: data.message
            }))
        }
    });
    ctx.websocket.on('close', (message) => {
        delete wsUser[ctx.query.userId]
    })
})

module.exports = router
