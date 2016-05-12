get-then
========

Give a URL, Get a Buffer.<br>
<sup>~40 lines of code</sup>

```js
var get = require('get-then')

get('https://api.github.com/users/williamkapke')
.then(JSON.parse)
.catch(String)
.then(console.log)
```

Need header data?
```js
var get = require('get-then')

get('https://api.github.com/users/williamkapke')
.then(buffer => {
  console.log(buffer.statusCode, buffer.statusMessage)
  console.log(buffer.headers)
  return buffer;
})
.then(console.log)// prints the buffer
```

### Other HTTP Methods
Ok, so you can do more then just `GET`s. It only added a few more lines of code.

The function returned can take 4 arguments: `function (url, headers, data, method)`<br>
(only the 1st is required)

If `data` is specified:<br>
• it will be passed to `JSON.stringify()`.<br>
• it will set the `Content-Length` header.<br>
• it will default to `POST` if `method` is not supplied.<br>

### User-Agent
A default `User-Agent` is specified as:
```
https://www.npmjs.com/package/get-then
```

To override this default:
```js
var get = require('get-then')
get.agent = 'My Fancy Script'
```


## License
[MIT Copyright (c) 2016 William Kapke](/LICENSE)
