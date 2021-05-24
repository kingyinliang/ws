const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/test', async (ctx, next) => {
  ctx.body = {
    code : 200,
    msg : 'success',
    data: 'test success'
  }
})

module.exports = router
