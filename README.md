# threesixty-js-sdk

[![Build Status](https://img.shields.io/travis/360player/threesixty-js-sdk.svg?style=flat)](https://travis-ci.org/360player/threesixty-js-sdk)
[![Dependency Status](https://david-dm.org/360player/threesixty-js-sdk/status.svg)](https://david-dm.org/360player/threesixty-js-sdk#info=dependencies)

JavaScript Development Kit for 360Player public APIs.


## Installing

Add dependency to `package.json`, and run `yarn`.

```json
{
	"dependencies": {
		"threesixty-js-sdk": "git@github.com:360player/threesixty-js-sdk.git"
	}
}
```

_Or_ to install a specific version, see [releases](https://github.com/360player/threesixty-js-sdk/releases).

```json
{
	"dependencies": {
		"threesixty-js-sdk": "git@github.com:360player/threesixty-js-sdk.git#v0.1.0"
	}
}
```


## Development

### Linting

Use [Flow](https://flowtype.org/) for code linting.

```sh
yarn run lint
```


### Testing

Use [Jest](https://facebook.github.io/jest/) for unit and functional tests.

```sh
yarn run test
```
