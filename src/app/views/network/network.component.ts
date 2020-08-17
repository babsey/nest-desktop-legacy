import { ChangeDetectorRef, Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { enterAnimation } from '../../animations/enter-animation';

import { Network } from '../../components/network/network';

import { NetworkSketchService } from '../../services/network/network-sketch.service';
import { ProjectService } from '../../services/project/project.service';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  animations: [ enterAnimation ],
})
export class NetworkComponent implements OnInit, AfterViewInit {
  @Input() network: Network;
  @ViewChild('content', { static: false }) content: ElementRef;
  public width: number = 600;
  public height: number = 400;
  public mode: string = 'selection';
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private _networkSketchService: NetworkSketchService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    public _projectService: ProjectService,
  ) {
    this.mobileQuery = _media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    // console.log('Init network')
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resize()
    }, 1)
  }

  toggleSidenav(): void {
    this._projectService.sidenavOpened = !this._projectService.sidenavOpened;
  }

  selectController(mode: string): void {
    if (this.mode == mode) {
      this._projectService.sidenavOpened = !this._projectService.sidenavOpened;
    } else {
      this.mode = mode;
      this._projectService.sidenavOpened = true;
    }
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  @HostListener('window:resize', [])
  resize(): void {
    var element = this.content['elementRef'].nativeElement;
    this.height = element.clientHeight;
    this.width = element.clientWidth;
  }

}
