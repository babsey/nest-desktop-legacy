import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: '[app-node-shape]',
  templateUrl: './node-shape.component.html',
  styleUrls: ['./node-shape.component.scss']
})
export class NodeShapeComponent implements OnInit {
  @Input() color: string = 'black';
  @Input() elementType: string = 'neuron';
  @Input() idx: any;
  @Input() selected: boolean = false;
  @Input() spatial: boolean = false;
  @Input() radius: number = 15;

  constructor(
  ) { }

  ngOnInit() {
  }

  square() {
    var a = this.radius / 2. * Math.sqrt(Math.PI);
    var points = [[-a,-a].join(','),[a,-a].join(','),[a,a].join(','),[-a,a].join(',')].join(' ');
    return points;
  }

  triangle() {
    var a = this.radius / 2. * Math.sqrt(2 * Math.PI);
    var alpha = 30. / 180. * Math.PI;
    var x = Math.sin(alpha) * a;
    var y = Math.cos(alpha) * a;
    var points = [[-x,y].join(','),[2*x,0].join(','),[-x,-y].join(',')].join(',');
    return points;
  }

  layer() {
    var a = this.radius + 3;
    var b = this.radius - 3;
    var points = [[a,0].join(','), [0,b].join(','), [-a,0].join(','), [0,-b].join(',')].join(' ');
    return points;
  }

}
