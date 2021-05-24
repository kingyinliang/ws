const router = require('koa-router')()

router.prefix('/v1')

router.get('/', function (ctx, next) {
    ctx.body = 'this is a v1 response!'
})

router.get('/test', function (ctx, next) {
    ctx.body = {
        code : 200,
        msg : 'success',
        data: 'test success'
    }
})

module.exports = router
