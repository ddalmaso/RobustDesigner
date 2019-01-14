/*
* File: app.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Francesco Minna
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

'use strict'

let Presentation = require('./Tier/PresentationTier/Middleware/Index.js');

const host = '127.0.0.1'; // localhost
const port = process.env.PORT || 3000;

let server = new Presentation(host, port);
server.start();
server.router();
