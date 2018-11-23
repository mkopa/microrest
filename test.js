const microrest = require('./index');

microrest.start(8080);
microrest.GET('/test', (() => 'OK'));