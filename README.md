# threesixty-js-sdk

[![Build Status](https://img.shields.io/travis/360player/threesixty-js-sdk.svg?style=flat)](https://travis-ci.org/360player/threesixty-js-sdk)
[![Dependency Status](https://david-dm.org/360player/threesixty-js-sdk/status.svg)](https://david-dm.org/360player/threesixty-js-sdk#info=dependencies)

JavaScript Development Kit for 360Player public APIs.


## Installing

```sh
yarn add threesixty-js-sdk
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


## Deploying

Make sure you have `babel-node` installed globally. Version can be either of `major`, `minor` or `patch`.

```sh
babel-node deploy <version>
```