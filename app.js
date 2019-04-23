const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'static')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    res.render('index');
});

let server = app.listen(8081, '127.0.0.1', ()=>{
    console.log(server.address().address + ':' + server.address().port);
});