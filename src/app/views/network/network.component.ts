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
  private _mobileQueryListener: () => void;
  public width: number = 600;
  public height: number = 400;
  public mode: string = 'selection';
  public mobileQuery: MediaQueryList;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    private _projectService: ProjectService,
    private _route: ActivatedRoute,
    private _router: Router,
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

  get sidenavOpened(): boolean {
    return this._projectService.sidenavOpened;
  }

  set sidenavOpened(value: boolean) {
    this._projectService.sidenavOpened = value;
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  selectController(mode: string): void {
    if (this.mode === mode) {
      this.sidenavOpened = !this.sidenavOpened;
    } else {
      this.mode = mode;
      this.sidenavOpened = true;
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
