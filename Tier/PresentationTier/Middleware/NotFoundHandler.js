/*
* File: NotFoundHandler.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Gianluca Travasci
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/
'use strict'

exports.handler = (req, res, next) =>{
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
} 
