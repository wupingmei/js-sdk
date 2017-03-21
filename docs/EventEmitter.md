# Event/Emitter

## Properties

| Type                     | Access    | Description                                         |
|--------------------------|-----------|-----------------------------------------------------|
| _maxListenerCount_ `int` | Read-Only | Max listener callback handler per event type.       |
| _eventStore_ `object`    | Read-Only | Returns event type and listener store as an object. |
| _eventTypes_ `array`     | Read-Only | Returns array of registered event types.            |


## Methods

### `setMaxListenerCount` ( newMaxListenerCount `int` ) _void_
Sets max listener count, see `getMaxListenerCount`. Same as `instance.maxListenerCount`.

### `getMaxListenerCount` () _int_
Returns max listener count. Same as `instance.maxListenerCount`.

### `getListeners` ( eventType `string` ) _array_
Returns array of listener callbacks registered to an event type.

### `listenerCount` ( eventType `string` ) _int_
Returns number of listener callbacks registered to an event type.

### `getListenerPosition` ( eventType `string`, eventListener `function` ) _array_
Returns position of event listener in event type store, returns `-1` if not found.

### `hasListener` ( eventType `string`, eventListener `function` ) _bool_
Returns boolean whether or not event listener is registered to event type.

### `addListener` ( eventType `string`, eventListener `function` ) _self_
Attempts to register an event listener callback to event type. Has an alias; `on`.

### `addOnceListener` ( eventType `string`, eventListener `function` ) _self_
Attempts to register an event listener callback that will only fire _once_ to event type. Has an alias ; `once`.

### `removeListener` ( eventType `string`, eventListener `function` ) _self_
Removes event listener callback from event type. Has an alias; `off`.

### `removeAllListeners` ( eventType `string` ) _self_
Removes _all_ registered event listeners to event type.

### `emit` ( eventType `string`, ...listenerArguments ) _void_
Emits event listener callbacks (to registered event type) if event type exists.