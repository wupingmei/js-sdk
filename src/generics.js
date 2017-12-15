/* @flow */

/**
 *	@type JsonPropertyValueType
 */
export type JsonPropertyValueType = string | number | boolean | null;

/**
 *	@type JsonPropertyArrayType
 */
export type JsonPropertyArrayType = Array<JsonPropertyValueType>;

/**
 *	@type JsonPropertyObjectType
 */
export type JsonPropertyObjectType = { [ key : string ] : JsonPropertyValueType | JsonPropertyArrayType | JsonPropertyObjectType };
