function anglePoint(deg: number, radius: number, y0: number = 0): number[] {
  const radian: number = deg / 180 * Math.PI;
  return [Math.cos(radian) * radius, y0 - Math.sin(radian) * radius];
}


function getHexagonPoints(radius: number): string {
  const a: number = radius * 1.1;
  const p0: number[] = anglePoint(0, a, 4);
  const p1: number[] = anglePoint(60, a, 4);
  const p2: number[] = anglePoint(120, a, 4);
  const p3: number[] = anglePoint(180, a, 4);
  const p4: number[] = anglePoint(240, a, 4);
  const p5: number[] = anglePoint(300, a, 4);
  const points: string = [
    p0.join(','),
    p1.join(','),
    p2.join(','),
    p3.join(','),
    p4.join(','),
    p5.join(',')].join(',');
  return points;
}

function getRectanglePoints(radius: number): string {
  const a: number = radius * Math.sqrt(Math.PI / 2);
  const b = 8;
  const p0: number[] = anglePoint(45 - b, a, 4);
  const p1: number[] = anglePoint(135 + b, a, 4);
  const p2: number[] = anglePoint(225 - b, a, 4);
  const p3: number[] = anglePoint(315 + b, a, 4);
  // const points: string = [[-x,y].join(','),[2*x,0].join(','),[-x,-y].join(',')].join(',');
  const points: string = [
    [p0[0] + b, p0[1]].join(','),
    [p1[0] + b, p1[1]].join(','),
    [p2[0] - b, p2[1]].join(','),
    [p3[0] - b, p3[1]].join(',')].join(',');
  return points;
}

function getRhombusPoints(radius: number): string {
  const a: number = radius + 4;
  const b: number = radius - 4;
  const points: string = [[a, 0].join(','), [0, b].join(','), [-a, 0].join(','), [0, -b].join(',')].join(' ');
  return points;
}

// function getSquarePoints(radius: number): string {
//   const a: number = radius / 2. * Math.sqrt(Math.PI);
//   const points: string = [[-a, -a].join(','), [a, -a].join(','), [a, a].join(','), [-a, a].join(',')].join(' ');
//   return points;
// }

function getSquarePoints(radius: number): string {
  const a: number = radius * Math.sqrt(Math.PI / 2);
  const p0: number[] = anglePoint(45, a, 4);
  const p1: number[] = anglePoint(135, a, 4);
  const p2: number[] = anglePoint(225, a, 4);
  const p3: number[] = anglePoint(315, a, 4);
  const points: string = [
    p0.join(','),
    p1.join(','),
    p2.join(','),
    p3.join(',')].join(',');
  return points;
}

function getTrianglePoints(radius: number): string {
  const a: number = radius * Math.sqrt(Math.PI / 2);
  const p0: number[] = anglePoint(90, a, 4);
  const p1: number[] = anglePoint(210, a, 4);
  const p2: number[] = anglePoint(330, a, 4);
  // const points: string = [[-x,y].join(','),[2*x,0].join(','),[-x,-y].join(',')].join(',');
  const points: string = [
    p0.join(','),
    p1.join(','),
    p2.join(',')].join(',');
  return points;
}


export function getPoints(shape: string, radius: number): string {
  switch (shape) {
    case 'rectangle':
      return getRectanglePoints(radius);
    case 'rhombus':
      return getRhombusPoints(radius);
    case 'hexagon':
      return getHexagonPoints(radius);
    case 'square':
      return getSquarePoints(radius);
    case 'triangle':
      return getTrianglePoints(radius);
    default:
      return getSquarePoints(radius);
  }
}
