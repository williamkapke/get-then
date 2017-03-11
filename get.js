var http = require('http')
var https = require('https')
var url_parse = require('url').parse
var debug = require('debug')('get-then')

var get = module.exports = function (url, headers, data, method, attempt = 0) {
  var options = url_parse(url)
  options.method = method ? method : data ? 'POST' : 'GET'
  options.headers = headers || {}
  if(module.exports.agent && !options.headers['User-Agent'])
    options.headers['User-Agent'] = module.exports.agent

  debug('%s $s', url, options.method)
  if (data) {
    data = JSON.stringify(data)
    headers[ 'Content-Length' ] = Buffer.byteLength(data)
  }
  return new Promise(function (accept, reject) {
    var chunks = []
    var h = (options.protocol === 'https:' ? https : http)
    var req = h.request(options, function (res) {
      res.on('data', function(chunk) { chunks.push(chunk) })
      res.on('close', reject)
      req.on('error', reject)
      res.on('end', function () {
        debug('%s %s', res.statusCode, res.statusMessage)
        if (/301|302/.test(res.statusCode) && res.headers.location && attempt < 5) {
          return get(res.headers.location, headers, data, method, ++attempt)
        }
        var result = Buffer.concat(chunks)
        result.statusCode = res.statusCode
        result.statusMessage = res.statusMessage
        result.headers = res.headers

        var happy = res.statusCode <= 200 || res.statusCode < 300
        return happy ? accept(result) : reject(result)
      })
    })
    .on('error', reject)

    if (data)
      req.write(data)
    req.end()
  })
}
get.agent = 'https://www.npmjs.com/package/get-then'