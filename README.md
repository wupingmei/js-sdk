# threesixty-js-sdk

[![Build Status](https://img.shields.io/travis/360player/threesixty-js-sdk.svg?style=flat)](https://travis-ci.org/360player/threesixty-js-sdk)
[![Dependency Status](https://david-dm.org/360player/threesixty-js-sdk/status.svg)](https://david-dm.org/360player/threesixty-js-sdk#info=dependencies)

JavaScript Development Kit for 360Player public APIs.


## Installing

```sh
yarn add git@github.com:360player/threesixty-js-sdk.git
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

The flag `--force` is used due to [this issue](https://github.com/npm/npm/issues/8620). You can specify `major`, `minor` and `patch` for the version.

```sh
npm version minor --force -m "Version 0.2.0"
```