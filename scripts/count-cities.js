"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timezones_1 = require("../src/data/timezones");
var cities = (0, timezones_1.getAvailableTimezones)();
console.log("Total cities in timezones data: ".concat(cities.length));
