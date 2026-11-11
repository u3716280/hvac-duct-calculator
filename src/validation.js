export function positive(value, name='ค่า') {
 if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 1e12) throw new Error(`${name}: กรุณาระบุค่ามากกว่า 0 และไม่เกิน 10¹²`);
 return value;
}
export function finiteResults(values) {
 for (const x of Object.values(values)) if (typeof x === 'number' && (!Number.isFinite(x) || x <= 0)) throw new Error('ผลลัพธ์อยู่นอกช่วงที่คำนวณได้');
 return values;
}
