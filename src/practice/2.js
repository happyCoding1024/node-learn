const { add, mul } = require('./1');
const _ = require('lodash');

const sum = add(10 ,20);
const result = mul(10, 20);
console.log(sum, result);

const arr = _.concat([1, 2], 3);
console.log('arr', arr);