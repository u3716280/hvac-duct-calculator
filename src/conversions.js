export const factors = Object.freeze({mm:0.001,inch:0.0254,'m/s':1,FPM:0.3048/60,CFM:0.3048**3/60,'m³/h':1/3600,'L/s':0.001});
export const toSI=(value,unit)=>value*factors[unit];
export const fromSI=(value,unit)=>value/factors[unit];
