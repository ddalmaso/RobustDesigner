/*
* File: ErrorHandler.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Daniele Dal Maso
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

'use strict'

exports.handler = (req, res, next) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
} 
