## rapidcat
![Screenshot](rapidcat.png)

Blazingly Fast, Exceptionally Lightweight, and Highly Flexible Web Framework for [Node.js](http://nodejs.org).


```js
const rapidcat = require('rapidcat');
const app = rapidcat();

app.get('/', function (req, res) {
  res.send('Hello World');
})

app.listen(3000);
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install rapidcat
```

Follow [our installing guide](http://rapidcat.com/en/starter/installing.html)
for more information.

## Features

  * Robust routing
  * Focus on high performance

## Philosophy

  The rapidcat philosophy is to provide small, robust tooling for HTTP servers, making
  it a great solution for single page applirapidcations, websites, hybrids, or public
  HTTP APIs.

## Contributing

The rapidcat project welcomes all constructive contributions. Contributions take many forms,
from code for bug fixes and enhancements, to additions and fixes to documentation, additional
tests, triaging incoming pull requests and issues, and more!

See the [Contributing Guide](Contributing.md) for more technical details on contributing.

### Security Issues

If you discover a security vulnerability in rapidcat, please see [Security Policies and Procedures](Security.md).

### Running Tests

To run the test suite, first install the dependencies, then run `npm test`:

```console
$ npm install
$ npm test
```

## People

The original author of rapidcat is [Ferhat Yalçın](https://github.com/ylcnfrht)


## License

  [MIT](LICENSE)
