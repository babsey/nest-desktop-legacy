import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Data } from '../../classes/data';
import { Record } from '../../classes/record';


@Component({
  selector: 'app-simulation-sidenav-content',
  templateUrl: './simulation-sidenav-content.component.html',
  styleUrls: ['./simulation-sidenav-content.component.scss']
})
export class SimulationSidenavContentComponent implements OnInit {
  @Input() data: Data;
  @Input() mode: string;
  @Input() records: Record[];
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() appChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('content', { static: false }) content: ElementRef;
  public width: number = 12;
  public height: number = 12;

  constructor() { }

  ngOnInit() {
    setTimeout(() => this.triggerResize(), 10)
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  onDataChange(data: Data): void {
    // console.log('Change input value in node selection')
    this.dataChange.emit(this.data)
  }

  onNodeChange(data: Data): void {
    // console.log('Change input value in node selection')
    this.appChange.emit(this.data.app)
  }

  @HostListener('window:resize', [])
  resize(): void {
    if (this.content == undefined) return
    const element: any = this.content.nativeElement;
    this.width = element.clientWidth;
    this.height = element.clientHeight;
  }

}
