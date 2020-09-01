import { Config } from '../config'
import { Connection } from './connection';


export class ConnectionMask {
  config: Config;
  connection: Connection;
  graph: any = {
    data: [],
    layout: {
      xaxis: { range: [-.55, .55] },
      yaxis: { range: [-.55, .55] }
    },
    style: { position: 'relative', width: '100%', height: '100%' }
  };
  masktype: string;
  specs: any;

  constructor(connection: Connection, mask: any = {}) {
    this.config = new Config(this.constructor.name);
    this.connection = connection;
    this.masktype = mask.masktype || 'none';
    this.specs = mask.specs || {};
  }

  list(): string[] {
    return Object.keys(this.config.data);
  }

  unmask(): void {
    this.masktype = 'none';
  }

  select(value: string): void {
    if (value === 'none') {
      this.unmask()
    } else {
      this.masktype = value;
      this.specs = {};
      this.config.data[value].specs.forEach(
        (spec: { id: string; value: any }) => {
          this.specs[spec.id] = spec.value;
        }
      );
    }
    this.draw();
  }

  draw(): void {
    this.graph.layout['shapes'] = [];
    if (this.masktype === undefined) return
    switch (this.masktype) {
      case 'rectangular':
        this.drawRect();
        break;
      case 'circular':
        this.drawCircle();
        break;
      case 'doughnut':
        this.drawDoughnut();
        break;
      case 'elliptical':
        this.drawEllipsis();
        break;
    }
  }

  drawRect(): void {
    this.graph.layout['shapes'] = [{
      type: 'rect',
      xref: 'x',
      yref: 'y',
      x0: this.specs.lower_left[0],
      y0: this.specs.lower_left[1],
      x1: this.specs.upper_right[0],
      y1: this.specs.upper_right[1],
      opacity: 0.2,
      fillcolor: 'blue',
      line: {
        color: 'blue',
      }
    }]
  }

  drawCircle(): void {
    this.graph.layout['shapes'] = [{
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: -1 * this.specs.radius,
      y0: -1 * this.specs.radius,
      x1: this.specs.radius,
      y1: this.specs.radius,
      opacity: 0.2,
      fillcolor: 'blue',
      line: {
        color: 'blue',
      }
    }]
  }

  drawDoughnut(): void {
    this.graph.layout['shapes'] = [{
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: -1 * this.specs.outer_radius,
      y0: -1 * this.specs.outer_radius,
      x1: this.specs.outer_radius,
      y1: this.specs.outer_radius,
      opacity: 0.2,
      fillcolor: 'blue',
      line: {
        color: 'blue',
      }
    }, {
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: -1 * this.specs.inner_radius,
      y0: -1 * this.specs.inner_radius,
      x1: this.specs.inner_radius,
      y1: this.specs.inner_radius,
      opacity: 1.,
      fillcolor: 'white',
      line: {
        color: 'white',
      }
      // }, {
      //   type: 'line',
      //   xref: 'x',
      //   yref: 'y',
      //   x0: -1 * specs.inner_radius,
      //   y0: 0,
      //   x1: specs.inner_radius,
      //   y1: 0,
      //   line: {
      //     width: 1,
      //     color: 'black',
      //   }
      // }, {
      //   type: 'line',
      //   xref: 'x',
      //   yref: 'y',
      //   x0: 0,
      //   y0: -1 * specs.inner_radius,
      //   x1: 0,
      //   y1: specs.inner_radius,
      //   line: {
      //     width: 1,
      //     color: 'black',
      //   }
    }]
  }

  drawEllipsis(): void {
    this.graph.layout['shapes'] = [{
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: -1 * this.specs.major_axis / 2,
      y0: -1 * this.specs.minor_axis / 2,
      x1: this.specs.major_axis / 2,
      y1: this.specs.minor_axis / 2,
      opacity: 0.2,
      fillcolor: 'blue',
      line: {
        color: 'blue',
      }
    }]
  }

  serialize(to: string) {
    const mask: any = {};
    if (to === 'simulator') {
      mask[this.masktype] = this.specs;
    } else {
      mask['masktype'] = this.masktype;
      mask['specs'] = this.specs;
    }
    return mask;
  }

}
