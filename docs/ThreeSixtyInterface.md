# ThreeSixtyInterface
#### Extends `Event/Emitter`

API interaction class, inherits from `Event/Emitter`.


## Events

| Event        | Description                                                     |
|--------------|-----------------------------------------------------------------|
| `connect`    | Fired upon successful connection (see `connect` and `useToken`) |
| `disconnect` | Fired when connection closes.                                   |
| `request`		 | Fired when a request is made, see `request`.                    |


## Properties

| Property                         | Access            | Description                           |
|----------------------------------|-------------------|---------------------------------------|
| _isConnected_ `boolean`          | Read-Only         | Connection state status.              |
| _isSandboxed_ `boolean`          | Read-Only         | Sandbox mode status.                  |
| _defaultRequestHeaders_ `object` | Static, Read-Only | Literal with default request headers. |
| _apiVersion_ `string`            | Read-Only         | Current API version (in use).         |
| _clientToken_ `string`           | Read-Only         | Client JWT Token from authentication. |


## Methods

### `_constructor_` ( apiVersion `string` ) _void_
Sets required instance variables.

### `sandboxed` ( requestFixtures `object`, requestMocks `object` ) _void_
Sets sandboxed mode, requires fixtures and mocks for each request. See source code repository (`fixtures` directory) for fixtures and mocks.

### `debugMode` () _void_
Sets debug mode, allows internal logging to console.

### `async request` ( endpointUrl `string`, requestMethod `string`, payload `object|null`, additionalHeaders `object|null` ) _Promise_
Attempts to make a new request to endpoint, if sandbox mode is active and fixtures are present, a resolved promise is returned. Emits `request`.

### `async connect` ( username `string`, string `string` ) _Promise_
Attempts to connect to authentication endpoint using credentials. Sets `clientToken` on success. Emits `request` (from `request`-method), `connect` on succes, `disconnect` on failure.

### `disconnect` () _void_
"Disconnects" by resetting connection state and nulling `clientToken`. Emits `disconnect` if not already disconnected.

### `useToken` ( apiToken `string` ) _void_
Sets authentication token (JWT recieved from API authentication or from `connect`). Emits `connect` if not already connected.

### `useEndpoint` ( newApiEndpointUrl `string` ) _void_
Overrides current API endpoint URL.