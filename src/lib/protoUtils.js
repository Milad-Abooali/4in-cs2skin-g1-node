// protoUtils.js
// Converts gRPC Struct / ListValue / Value recursively into plain JS objects/arrays

function protoToObject(value) {
    if (!value || typeof value !== 'object') return value;

    // Struct type
    if (value.fields) {
        const obj = {};
        for (const [key, val] of Object.entries(value.fields)) {
            obj[key] = protoToObject(val);
        }
        return obj;
    }

    // ListValue type
    if (value.listValue && Array.isArray(value.listValue.values)) {
        return value.listValue.values.map(protoToObject);
    }

    // Single value types
    if (value.kind === 'numberValue') return value.numberValue;
    if (value.kind === 'stringValue') return value.stringValue;
    if (value.kind === 'boolValue') return value.boolValue;
    if (value.kind === 'nullValue') return null;
    if (value.kind === 'structValue') return protoToObject(value.structValue);
    if (value.kind === 'listValue') return protoToObject(value.listValue);

    return value;
}

module.exports = { protoToObject };
