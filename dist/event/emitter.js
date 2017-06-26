'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('es6-symbol/implement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	@const int EVENT_MIN_LISTENERS
 */
var EVENT_MIN_LISTENERS = 1;

/**
 *	@const int EVENT_MAX_LISTENERS
 */


/* @dependencies */
var EVENT_MAX_LISTENERS = 10;

/**
 *	@const Symbol EVENT_STORE
 */
var EVENT_STORE = Symbol('EVENT_STORE');

/**
 *	Emitter
 *
 *	Event emitter class.
 */

var Emitter = function () {

	/**
  *	Constructor
  *
  *	Creates a new instance of Emitter.
  *
  *	@return void
  */
	function Emitter() {
		(0, _classCallCheck3.default)(this, Emitter);
		this.maxListenerCount = EVENT_MAX_LISTENERS;
		this.on = this.addListener.bind(this);
		this.once = this.addOnceListener.bind(this);
		this.off = this.removeListener.bind(this);

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


	/**
  *	@var int maxListenerCount
  */


	(0, _createClass3.default)(Emitter, [{
		key: 'setMaxListenerCount',


		/**
   *	setMaxListenerCount
   *
   *	Sets new max listener count per event type.
   *
   *	@param int newMaxListenerCount
   *
   *	@return void
   */
		value: function setMaxListenerCount(newMaxListenerCount) {
			if (isNaN(newMaxListenerCount) === true) return;
			var checkFloat = parseFloat(newMaxListenerCount);

			if ((checkFloat | 0) === checkFloat && newMaxListenerCount >= EVENT_MIN_LISTENERS) {
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

	}, {
		key: 'getMaxListenerCount',
		value: function getMaxListenerCount() {
			return this.maxListenerCount;
		}

		/**
   *	@prop eventTypes
   *
   *	Returns all registered event types to current instance.
   *
   *	@return array
   */

	}, {
		key: 'getListeners',


		/**
   *	getListeners
   *
   *	Returns all registered listeners to event type.
   *
   *	@param string eventType
   *
   *	@return array
   */
		value: function getListeners(eventType) {
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

	}, {
		key: 'listenerCount',
		value: function listenerCount(eventType) {
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

	}, {
		key: 'getListenerPosition',
		value: function getListenerPosition(eventType, eventListener) {
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

	}, {
		key: 'hasListener',
		value: function hasListener(eventType, eventListener) {
			if (this.eventTypes.indexOf(eventType) >= 0) {
				return this.getListenerPosition(eventType, eventListener) >= 0;
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

	}, {
		key: 'addListener',
		value: function addListener(eventType, eventListener) {

			if (this.hasListener(eventType, eventListener) === true) {
				return this;
			}

			if (this.getListeners(eventType).length >= this.maxListenerCount) {
				throw new RangeError('Possible memory leak, max listener count exceeded.');
			}

			if (this.eventStore.hasOwnProperty(eventType) === false) {
				this.eventStore[eventType] = [];
			}

			this.eventStore[eventType].push(eventListener);

			return this;
		}

		// @alias for {@see addListener}

	}, {
		key: 'addOnceListener',


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
		value: function addOnceListener(eventType, eventListener) {
			var _this = this,
			    _arguments = arguments;

			var selfRemovingEventListener = function selfRemovingEventListener() {
				_this.removeListener(eventType, selfRemovingEventListener);
				eventListener.apply(_this, _arguments);
			};

			return this.addListener(eventType, selfRemovingEventListener);
		}

		// @alias for {@see addOnceListener}

	}, {
		key: 'removeListener',


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
		value: function removeListener(eventType, eventListener) {
			if (this.hasListener(eventType, eventListener) === true) {
				var listenerPosition = this.getListenerPosition(eventType, eventListener);
				this.eventStore[eventType].splice(listenerPosition, 1);
			}

			return this;
		}

		// @alias for {@see removeListener}

	}, {
		key: 'removeListeners',


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
		value: function removeListeners(eventType) {
			var _this2 = this;

			for (var _len = arguments.length, eventListeners = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				eventListeners[_key - 1] = arguments[_key];
			}

			eventListeners.forEach(function (eventListener) {
				_this2.removeListener(eventType, eventListener);
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

	}, {
		key: 'removeAllListeners',
		value: function removeAllListeners(eventType) {
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

	}, {
		key: 'emit',
		value: function emit(eventType) {
			for (var _len2 = arguments.length, listenerArguments = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				listenerArguments[_key2 - 1] = arguments[_key2];
			}

			if (this.eventStore.hasOwnProperty(eventType) === true) {
				this.eventStore[eventType].forEach(function (eventListener) {
					eventListener.apply(null, listenerArguments);
				});
			}
		}
	}, {
		key: 'eventStore',
		get: function get() {
			// @FLOWFIXME
			return this[EVENT_STORE];
		}
	}, {
		key: 'eventTypes',
		get: function get() {
			return Object.keys(this.eventStore);
		}
	}]);
	return Emitter;
}();

exports.default = Emitter;