/* @flow */

/* @dependencies */
import 'es6-symbol/implement'

/**
 *	@const int EVENT_MIN_LISTENERS
 */
const EVENT_MIN_LISTENERS : number = 1;

/**
 *	@const int EVENT_MAX_LISTENERS
 */
const EVENT_MAX_LISTENERS : number = 10;

/**
 *	@const Symbol EVENT_STORE
 */
const EVENT_STORE = Symbol('EVENT_STORE');


/**
 *	Emitter
 *
 *	Event emitter class.
 */
export default class Emitter {

	/**
	 *	@var int maxListenerCount
	 */
	maxListenerCount : number = EVENT_MAX_LISTENERS;

	/**
	 *	Constructor
	 *
	 *	Creates a new instance of Emitter.
	 *
	 *	@return void
	 */
	constructor() : void {
		// @FLOWFIXME
		this[EVENT_STORE] = {};
	}

	/**
	 *	@prop eventStore
	 *
	 *	Returns current event store.
	 *
	 *	@return object
	 */
	get eventStore() : Object {
		// @FLOWFIXME
		return this[EVENT_STORE];
	}

	/**
	 *	setMaxListenerCount
	 *
	 *	Sets new max listener count per event type.
	 *
	 *	@param int newMaxListenerCount
	 *
	 *	@return void
	 */
	setMaxListenerCount( newMaxListenerCount : number ) : void {
		if (isNaN(newMaxListenerCount) === true) return;
		let checkFloat = parseFloat(newMaxListenerCount);

		if (((checkFloat | 0) === checkFloat) && newMaxListenerCount >= EVENT_MIN_LISTENERS) {
			this.maxListenerCount = newMaxListenerCount;
		}
	}

	/**
	 *	getMaxListenerCount
	 *
	 *	Returns current max listener count.
	 *
	 *	@return int
	 */
	getMaxListenerCount() : number {
		return this.maxListenerCount;
	}

	/**
	 *	@prop eventTypes
	 *
	 *	Returns all registered event types to current instance.
	 *
	 *	@return array
	 */
	get eventTypes() : Array<string> {
		return Object.keys(this.eventStore);
	}

	/**
	 *	getListeners
	 *
	 *	Returns all registered listeners to event type.
	 *
	 *	@param string eventType
	 *
	 *	@return array
	 */
	getListeners( eventType : string ) : Array<mixed> {
		if (this.eventTypes.indexOf(eventType) >= 0) {
			return Object.values(this.eventStore[eventType]);
		}
		return [];
	}

	/**
	 *	listenerCount
	 *
	 *	Returns listener count to event type.
	 *
	 *	@param string eventType
	 *
	 *	@return int
	 */
	listenerCount( eventType : string ) : number {
		return this.getListeners(eventType).length;
	}

	/**
	 *	getListenerPosition
	 *
	 *	Returns index of event listener in event store.
	 *
	 *	@param string eventType
	 *	@param callable eventListener
	 *
	 *	@return int
	 */
	getListenerPosition( eventType : string, eventListener : Function ) : number {
		return this.getListeners(eventType).indexOf(eventListener);
	}

	/**
	 *	hasListener
	 *
	 *	Validates whether or not event type has a specific listener registered.
	 *
	 *	@param string eventType
	 *	@param callable eventListener
	 *
	 *	@return bool
	 */
	hasListener( eventType : string, eventListener : Function ) : bool {
		if (this.eventTypes.indexOf(eventType) >= 0) {
			return (this.getListenerPosition(eventType, eventListener)>= 0);
		}

		return false;
	}

	/**
	 *	addListener
	 *
	 *	Attempts to add an event listener to event type.
	 *
	 *	@param string eventType
	 *	@param callable eventListener
	 *
	 *	@return self
	 */
	addListener( eventType : string, eventListener : Function ) : Emitter {

		if (this.hasListener(eventType, eventListener) === true) {
			return this;
		}

		if (this.getListeners(eventType).length >= this.maxListenerCount) {
			throw new RangeError(`Possible memory leak, max listener count exceeded.`);
		}

		if (this.eventStore.hasOwnProperty(eventType) === false) {
			this.eventStore[eventType] = [];
		}

		this.eventStore[eventType].push(eventListener);

		return this;
	}

	// @alias for {@see addListener}
	on = this.addListener.bind(this)

	/**
	 *	addOnceListener
	 *
	 *	Creates a self removing event listener and registerers it.
	 *
	 *	@param string eventType
	 *	@param callable eventListener
	 *
	 *	@return self
	 */
	addOnceListener( eventType : string, eventListener : Function ) : Emitter {
		const selfRemovingEventListener = () => {
			this.removeListener(eventType, selfRemovingEventListener);
			eventListener.apply(this, arguments);
		}

		return this.addListener(eventType, selfRemovingEventListener);
	}

	// @alias for {@see addOnceListener}
	once = this.addOnceListener.bind(this)

	/**
	 *	removeListener
	 *
	 *	Attempts to remove event listener.
	 *
	 *	@param string eventType
	 *	@param callable eventListener
	 *
	 *	@return self
	 */
	removeListener( eventType : string, eventListener : Function ) : Emitter {
		if (this.hasListener(eventType, eventListener) === true) {
			let listenerPosition = this.getListenerPosition(eventType, eventListener);
			this.eventStore[eventType].splice(listenerPosition, 1);
		}

		return this;
	}

	// @alias for {@see removeListener}
	off = this.removeListener.bind(this)

	/**
	 *	removeListeners
	 *
	 *	Removes all specified event listeners.
	 *
	 *	@param string eventType
	 *	@param callable eventListeners, ...
	 *
	 *	@return self
	 */
	removeListeners(eventType : string, ...eventListeners : Array<Function>) : Emitter {
		eventListeners.forEach((eventListener) => {
			this.removeListener(eventType, eventListener);
		});

		return this;
	}

	/**
	 *	removeAllListeners
	 *
	 *	Removes all listeners to registered event type.
	 *
	 *	@param string eventType
	 *
	 *	@return self
	 */
	removeAllListeners(eventType : string) : Emitter {
		if (this.eventStore.hasOwnProperty(eventType) === true) {
			this.eventStore[eventType] = [];
		}

		return this;
	}

	/**
	 *	emit
	 *
	 *	Emits event listeners attached to an event type.
	 *
	 *	@param string eventType
	 *	@param mixed listenerArguments, ...
	 *
	 *	@return void
	 */
	emit( eventType : string , ...listenerArguments : Array<any> ) : void {
		if (this.eventStore.hasOwnProperty(eventType) === true) {
			this.eventStore[eventType].forEach(eventListener => {
				eventListener.apply(null, listenerArguments)
			});
		}
	}

}
