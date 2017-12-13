# ![js-toolkit-logo](https://rawgit.com/360player/js-sdk/new-api/js-sdk--small.svg) JavaScript SDK
[![Build Status](https://img.shields.io/travis/360player/js-sdk.svg?style=flat)](https://travis-ci.org/360player/js-sdk) [![devDependency Status](https://david-dm.org/360player/js-sdk/dev-status.svg)](https://david-dm.org/360player/js-sdk#info=devDependencies)

### JavaScript Development Kit for [360Player](https://360player.com/) public APIs.

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
