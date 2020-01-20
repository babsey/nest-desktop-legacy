import { ChangeDetectorRef, Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { NetworkService } from './services/network.service';
import { NetworkSketchService } from './network-sketch/network-sketch.service';
import { SimulationService } from '../simulation/services/simulation.service';
import { SimulationProtocolService } from '../simulation/services/simulation-protocol.service';

import { Data } from '../classes/data';

import { enterAnimation } from '../animations/enter-animation';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  animations: [ enterAnimation ],
})
export class NetworkComponent implements OnInit, AfterViewInit {
  @Input() data: Data;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('content', { static: false }) content: ElementRef;
  public width: number = 600;
  public height: number = 400;
  public mode: string = 'selection';
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    private _simulationProtocolService: SimulationProtocolService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private route: ActivatedRoute,
    private router: Router,
    public _simulationService: SimulationService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    // console.log('Init network')
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resize()
    }, 1)
  }

  toggleSidenav(): void {
    this._simulationService.sidenavOpened = !this._simulationService.sidenavOpened;
  }

  selectController(mode: string): void {
    if (this.mode == mode) {
      this._simulationService.sidenavOpened = !this._simulationService.sidenavOpened;
    } else {
      this.mode = mode;
      this._simulationService.sidenavOpened = true;
    }
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  onDataChange(data: Data): void {
    // console.log('Network on data change')
    this.dataChange.emit(this.data)
  }

  @HostListener('window:resize', [])
  resize(): void {
    var element = this.content['elementRef'].nativeElement;
    this.height = element.clientHeight;
    this.width = element.clientWidth;
  }

}
