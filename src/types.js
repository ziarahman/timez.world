"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimezoneUniqueId = getTimezoneUniqueId;
/**
 * Generate a consistent unique identifier for a timezone
 * This combines the timezone ID and city name to create a unique key
 * that can be used for identification, comparison, and as a React key
 */
function getTimezoneUniqueId(timezone) {
    return "".concat(timezone.id, "_").concat(timezone.city);
}
