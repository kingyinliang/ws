const port = 3001;
const Koa = require('koa')
const websockify = require('koa-websocket')
const bodyparser = require('koa-bodyparser')

const app = websockify(new Koa());

const ws = require('./routes/ws')

app.ws.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))
app.ws.use(ws.routes())

app.listen(port, () => {
    console.log("localhost:" + port);
});
