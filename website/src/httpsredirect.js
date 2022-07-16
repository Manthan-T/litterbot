// Adapted from https://stackoverflow.com/questions/45515251/how-to-redirect-http-to-https-for-a-reactjs-spa-behind-aws-elb

const express = require('express');
const path = require('path');
const util = require('util');
const app = express();

/**
 * Listener port for the application.
 *
 * @type {number}
 */
const port = 80;

/**
 * Identifies requests from clients that use http(unsecure) and
 * redirects them to the corresponding https(secure) end point.
 *
 * Identification of protocol is based on the value of non
 * standard http header 'X-Forwarded-Proto', which is set by
 * the proxy(in our case AWS ELB).
 * - when the header is undefined, it is a request sent by
 * the ELB health check.
 * - when the header is 'http' the request needs to be redirected
 * - when the header is 'https' the request is served.
 *
 * @param req the request object
 * @param res the response object
 * @param next the next middleware in chain
 */
const redirectionFilter = function (req, res, next) {
  res.redirect(301, "https://www.thequintuscult.co.uk/");
};

/**
 * Apply redirection filter to all requests
 */
app.get('/*', redirectionFilter);

console.log(`Server listening on ${port}...`);
app.listen(port);
