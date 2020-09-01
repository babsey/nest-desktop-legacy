
export function getSquarePoints(radius: number): string {
  const a: number = radius / 2. * Math.sqrt(Math.PI);
  const points: string = [[-a, -a].join(','), [a, -a].join(','), [a, a].join(','), [-a, a].join(',')].join(' ');
  return points;
}

function anglePoint(deg: number, radius: number, y0: number = 0): number[] {
  const radian: number = deg / 180 * Math.PI;
  return [Math.cos(radian) * radius, y0 + Math.sin(radian) * radius];
}

export function getTrianglePoints(radius: number): string {
  const a: number = radius * Math.sqrt(Math.PI / 2);
  const p0: number[] = anglePoint(-90, a, 4);
  const p1: number[] = anglePoint(-210, a, 4);
  const p2: number[] = anglePoint(-330, a, 4);
  // const points: string = [[-x,y].join(','),[2*x,0].join(','),[-x,-y].join(',')].join(',');
  const points: string = [p0.join(','), p1.join(','), p2.join(',')].join(',');
  return points;
}

export function getLayerPoints(radius: number): string {
  const a: number = radius + 4;
  const b: number = radius - 4;
  const points: string = [[a, 0].join(','), [0, b].join(','), [-a, 0].join(','), [0, -b].join(',')].join(' ');
  return points;
}
