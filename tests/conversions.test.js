import {test} from 'node:test';import assert from 'node:assert/strict';import {toSI,fromSI,factors} from '../src/conversions.js';
test('inch to mm',()=>assert.equal(fromSI(toSI(10,'inch'),'mm'),254));
test('m/s to FPM',()=>assert.ok(Math.abs(fromSI(10,'FPM')-1968.503937)<1e-6));
test('unit round trips',()=>{for(const u of Object.keys(factors)){let value=12.3456789;for(let i=0;i<100;i++) value=fromSI(toSI(value,u),u);assert.ok(Math.abs(value-12.3456789)<1e-10);}});
