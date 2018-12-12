import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sketch',
  templateUrl: './sketch.component.html',
  styleUrls: ['./sketch.component.css']
})
export class SketchComponent implements OnInit {
  @Input() data: any
  @Input() width: any;
  @Input() height: any;

  constructor() { }

  ngOnInit() {
  }

}
