# JavaScript SDK

### JavaScript Development Kit for [360Player](https://360player.com/) public APIs.

[![Build Status][build-status-badge]][build-status-url]
[![Dependency Status][dependency-status-badge]][dependency-status-url]

## Installing

Install toolkit via `yarn`.
```sh
yarn add https://github.com/360player/js-sdk.git --save
```

## Development

### Linting, typechecking and testing

Code *MUST* be linted with [ESLint](https://eslint.org/), typechecked with [Flow](https://flowtype.org/) and tested with [Jest](https://facebook.github.io/jest/).
You can run each section individually via `yarn run lint`, `yarn run flow` or `yarn run test`. Or run them all in order via `yarn run code-quality`

## Contributing

- Every new feature, function or class **MUST** have specs, be fully documented and _flowtyped_.
- Every new feature, function or class **CANNOT** have any polyfills and **MUST** be ES7 compliant.

[build-status-badge]: https://travis-ci.org/360player/js-sdk.svg?branch=new-api
[build-status-url]: https://travis-ci.org/360player/js-sdk
[dependency-status-badge]: https://david-dm.org/360player/js-sdk/dev-status.svg
[dependency-status-url]: https://david-dm.org/360player/js-sdk#info=devDependencies
