export interface Vec2 {
    x: number;
    y: number;
}

export const vec2 = {
  create: (x = 0, y = 0): Vec2 => ({ x, y }),
 
  add: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y }),
 
  sub: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y }),
 
  mul: (a: Vec2, scalar: number): Vec2 => ({ x: a.x * scalar, y: a.y * scalar }),
 
  len: (a: Vec2): number => Math.sqrt(a.x * a.x + a.y * a.y),
 
  lenSq: (a: Vec2): number => a.x * a.x + a.y * a.y,
 
  norm: (a: Vec2): Vec2 => {
    const l = vec2.len(a);
    return l > 0 ? { x: a.x / l, y: a.y / l } : { x: 0, y: 0 };
  },
 
  dist: (a: Vec2, b: Vec2): number => vec2.len(vec2.sub(a, b)),
 
  distSq: (a: Vec2, b: Vec2): number => vec2.lenSq(vec2.sub(a, b)),
 
  dot: (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y,
 
  rotate: (a: Vec2, angle: number): Vec2 => ({
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle),
  }),
 
  lerp: (a: Vec2, b: Vec2, t: number): Vec2 => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  }),
 
  random: (minMag: number, maxMag: number): Vec2 => {
    const angle = Math.random() * Math.PI * 2;
    const mag = minMag + Math.random() * (maxMag - minMag);
    return { x: Math.cos(angle) * mag, y: Math.sin(angle) * mag };
  },
 
  clone: (a: Vec2): Vec2 => ({ x: a.x, y: a.y }),
 
  zero: (): Vec2 => ({ x: 0, y: 0 }),
};
