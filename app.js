'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

const BinaryServer = require('binaryjs').BinaryServer;
const fs = require('fs');
const wav = require('wav');

let outFile = 'demo.wav';

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
  res.render('index');
});

app.listen(PORT);

console.log('server open on port ' + PORT);

let binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
  console.log('new connection');

  let fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log('new stream');
    stream.pipe(fileWriter);

    stream.on('end', function() {
      fileWriter.end();
      console.log('wrote to file ' + outFile);
    });
  });
});
