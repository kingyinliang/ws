const port = 3000;
const Koa = require('koa')
const cors = require('koa-cors')
const websockify = require('koa-websocket')
const bodyparser = require('koa-bodyparser')

const app = websockify(new Koa());

const v1 = require('./routes/v1')

app.ws.use(cors())

const ws = require('./routes/ws')

app.ws.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))
app.ws.use(ws.routes())
app.ws.use(v1.routes(), v1.allowedMethods())

app.listen(port, () => {
    console.log("localhost:" + port);
});
