import { Component, OnInit, Input } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: 'app-links-view',
  templateUrl: './links-view.component.html',
  styleUrls: ['./links-view.component.css']
})
export class LinksViewComponent implements OnInit {
  @Input() data: any;
  @Input() selectiveView: any = false;

  constructor(
    public _colorService: ColorService,
    public _dataService: DataService,
    public _sketchService: SketchService,
  ) { }

  ngOnInit() {
  }

}
