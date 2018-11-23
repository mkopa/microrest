const http = require('http');

const GETRouting = new Map();
const POSTRouting = new Map();
const PUTRouting = new Map();
const DELETERouting = new Map();
const Logger = (() => { });

let server = null;

module.exports = {
  start: ((port = 8080) => {
    if (!server) {
      const server = http.createServer((req, res) => {
        let controller = null;
        
        if (req.method === 'GET') {
          res.statusCode = 200;
          controller = GETRouting.get(req.url);
        } else if (req.method === 'POST') {
          res.statusCode = 201;
          controller = POSTRouting.get(req.url);
        } else if (req.method === 'PUT') {
          res.statusCode = 200;
          controller = PUTRouting.get(req.url);
        } else if (req.method === 'DELETE') {
          res.statusCode = 203;
          controller = DELETERouting.get(req.url);
        }

        if (!controller) {
          res.statusCode = 500;
          res.end(`Unknown path ${req.url}`);
          return;
        }
        res.end(controller());
      })

      server.on('clientError', (err, socket) => {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      });

      Logger(`Server started on port: ${port}`);

      server.listen(port);
    }
  }),

  GET: ((url, controller) => {
    GETRouting.set(url, controller);
  }),

  POST: ((url, controller) => {
    POSTRouting.set(url, controller);
  }),

  PUT: ((url, controller) => {
    PUTRouting.set(url, controller);
  }),

  DELETE: ((url, controller) => {
    DELETERouting.set(url, controller);
  }),
};