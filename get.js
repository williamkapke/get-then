var http = require('http')
var https = require('https')
var url_parse = require('url').parse

var get = module.exports = function (url, headers, data, method) {
  var options = url_parse(url)
  options.method = method ? method : data ? 'POST' : 'GET'
  options.headers = headers || {}
  if(module.exports.agent && !options.headers['User-Agent'])
    options.headers['User-Agent'] = module.exports.agent

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
        var data = Buffer.concat(chunks)
        data.statusCode = res.statusCode
        data.statusMessage = res.statusMessage
        data.headers = res.headers

        var happy = res.statusCode <= 200 || res.statusCode < 300
        return happy ? accept(data) : reject(data)
      })
    })
    .on('error', reject)

    if (data)
      req.write(data)
    req.end()
  })
}
get.agent = 'https://www.npmjs.com/package/get-then'