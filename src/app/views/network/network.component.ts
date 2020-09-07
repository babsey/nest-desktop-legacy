import { ChangeDetectorRef, Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { enterAnimation } from '../../animations/enter-animation';

import { Network } from '../../components/network/network';

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
  private _height: number = 400;
  private _mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  private _mode: string = 'selection';
  private _width: number = 600;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    private _projectService: ProjectService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this._mobileQuery = _media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this._mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    // console.log('Init network')
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resize()
    }, 1)
  }

  get height(): number {
    return this._height;
  }

  get mobileQuery(): MediaQueryList {
    return this._mobileQuery;
  }

  get mode(): string {
    return this._mode;
  }

  get sidenavOpened(): boolean {
    return this._projectService.sidenavOpened;
  }

  set sidenavOpened(value: boolean) {
    this._projectService.sidenavOpened = value;
  }

  get width(): number {
    return this._width;
  }

  toggleSidenav(): void {
    this._projectService.sidenavOpened = !this._projectService.sidenavOpened;
  }

  selectController(mode: string): void {
    if (this.mode === mode) {
      this._projectService.sidenavOpened = !this._projectService.sidenavOpened;
    } else {
      this._mode = mode;
      this._projectService.sidenavOpened = true;
    }
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  @HostListener('window:resize', [])
  resize(): void {
    const element: any = this.content['elementRef'].nativeElement;
    this._height = element.clientHeight;
    this._width = element.clientWidth;
  }

}
