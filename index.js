var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 80;

let nicks = []

server.listen(port, () => {
    console.log('Server listening at port %d', port);
  });


app.use(express.static(path.join(__dirname + '/public')));
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`)
    
    socket.on('sendMessage', data => {
        let dataaa = { nickname: data.nickname, socketid: socket.id}
        console.log(nicks)
        if(data.nickname == 'PrOnTo!'){
            for(var c = 0; 0 < nicks.length; c++){
                if(c == (nicks.length - 1)){
                    socket.broadcast.to(nicks[c].socketid).emit('receivedMessage', {nickname: nicks[0].nickname});
                }else{
                    if(nicks[c+1]== undefined) return
                    socket.broadcast.to(nicks[c].socketid).emit('receivedMessage', {nickname: nicks[c+1].nickname});
                }
            }
            nicks = []
            return
        }
        console.log(nicks)
        nicks.push(dataaa)
    })
})
