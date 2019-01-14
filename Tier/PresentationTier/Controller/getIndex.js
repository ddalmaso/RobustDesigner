/*
* File: getIndex.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Marco Masiero
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/
'use strict'

var path = require('path');

exports.getIndex = () => {  
	return path.join(__dirname, '../../public', 'index.html');
}
