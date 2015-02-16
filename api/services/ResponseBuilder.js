/*global sails*/

module.exports = {
  setHeaders: function(res) {
    res.header('Server', sails.config.osm.serverName);
    // http://john.sh/blog/2011/6/30/cross-domain-ajax-expressjs-
    // and-access-control-allow-origin.html
    res.header('Access-Control-Allow-Origin', sails.config.osm.accessControlAllowOrigin);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Content-Security-Policy', 'default-src "none"');
    // https://www.owasp.org/index.php/REST_Security_Cheat_Sheet
    // #Send_security_headers
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'deny');
    res.header('X-XSS-Protection', '1; mode=block');

    return res;
  }
};
