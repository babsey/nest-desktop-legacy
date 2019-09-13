import { Component, OnInit, OnChanges, OnDestroy, Input, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';

import * as STATS from 'stats.js';

import { AnimationControllerService } from '../visualization-controller/animation-controller/animation-controller.service';


@Component({
  selector: 'app-three-scatter',
  templateUrl: './three-scatter.component.html',
  styleUrls: ['./three-scatter.component.scss']
})
export class ThreeScatterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: any[] = [];
  @Input() frames: any[] = [];
  @Input() layout: any = {};
  // @Input() config: any = {};
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef;
  private camera: THREE.PerspectiveCamera;
  private grid: THREE.GridHelper;
  private controls: OrbitControls;
  private geometry: THREE.SphereGeometry;
  private renderer: THREE.WebGLRenderer;
  private requestID: any;
  private scene: THREE.Scene;
  private stats: STATS;
  private subscription: any;
  private useStats: boolean = false;

  constructor(
    public _animationControllerService: AnimationControllerService,
    private element: ElementRef,
  ) { }

  ngOnInit() {
    // console.log('Three scatter on init')
    if (this.useStats) {
      this.stats = new STATS();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom);
    }

    this.subscription = this._animationControllerService.update.subscribe(() => this.frameUpdate())

    setTimeout(() => this.onResize(), 1)
    this.init()
    this.animate()
  }

  ngOnDestroy() {
    // console.log('Three scatter on destroy')
    cancelAnimationFrame(this.requestID);
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Three scatter on changes')
    // cancelAnimationFrame(this.requestID);
    // this.init()
    // this.animate()
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  init() {
    // console.log('Init three scatter')
    this._animationControllerService.frames.length = this.frames.length;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfefefe);

    var aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(5, aspect, 1, 10000);
    this.updateCameraPosition()
    this.scene.add(this.camera);

    this.grid = new THREE.GridHelper(1, 10);
    this.grid.position.x = .5;
    this.grid.geometry.rotateZ(Math.PI / 2);
    this.scene.add(this.grid);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.element.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1;
    this.controls.zoomSpeed = 1.2;
    this.controls.enableKeys = false;

    this.geometry = new THREE.SphereGeometry(.002);
    this.data.map(d => this.dataUpdate(d))
  }

  animate() {
    // console.log('Animate three scatter')
    var _this = this;
    function render() {
      var frames = _this._animationControllerService.frames;

      setTimeout(() => {

        _this.requestID = requestAnimationFrame(render);

        if (_this.stats) {
          _this.stats.begin();
        }

        if (_this._animationControllerService.animation) {
          _this.frameUpdate()
          frames.idx = (frames.idx + frames.windowSize) % frames.length;
        }

        var camera = _this._animationControllerService.camera;
        if (camera.control) {
          if (camera.rotation.speed > 0) {
            _this.moveCamera()
          }
          _this.updateCameraPosition()
        }

        if (_this.stats) {
          _this.stats.end();
        }

      }, 1000 / frames.rate);

      _this.renderer.render(_this.scene, _this.camera);
    }

    render()
    this.frameUpdate()
  }

  dataUpdate(d, config = {}) {
    if (d == undefined) return
    var data = this.data[d.idx];
    if (data.mode != 'markers') return

    var extent = this.layout['extent'] || [[-.5, .5], [-.5, .5]];
    var ndim = extent.length;

    var color = config['color'] || data.marker['color'] || 'black';
    var opacity = config.hasOwnProperty('opacity') ? config['opacity'] : data['opacity'] || 1;
    var scale = this._animationControllerService.dotSize * (config['scale'] || 1);

    var frames = this._animationControllerService.frames;
    var trail = this._animationControllerService.trail;
    var ts = frames.idx / 10;

    for (var i = 0; i < d.x.length; i++) {
      var material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity });
      var object = new THREE.Mesh(this.geometry, material);
      object.position.x = .5 - (trail.mode == 'temporal' ? ((ts - d.x[i]) / frames.windowSize) : 0);
      object.position.y = d.y[i];
      if (ndim > 2) {
        object.position.z = d.z[i];
      } else {
      }
      if (scale != 1) {
        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;
      }
      this.scene.add(object);
    }

  }

  frameUpdate() {
    if (this.frames == undefined) return
    if (this.frames.length == 0) return
    this.scene.children.slice(2).map(object => this.scene.remove(object));

    var frame: any;
    var frames = this._animationControllerService.frames;
    for (var frameIdx = 0; frameIdx < frames.windowSize; frameIdx++) {
      frame = this.frames[frames.idx + frameIdx];
      if (frame) {
        frame.data.map(d => this.dataUpdate(d))
      }
    }

    var ratio: number;
    var scale: number;
    var opacity: number;
    var trail = this._animationControllerService.trail;
    for (var trailIdx = 0; trailIdx < trail.length; trailIdx++) {
      frame = this.frames[frames.idx - trailIdx];
      if (frame) {
        ratio = trailIdx / (trail.length + 1);
        opacity = 1 - (trail.fading ? ratio : 0);
        switch (trail.mode) {
          case 'growing':
            scale = 1 + ratio;
            break;
          case 'shrinking':
            scale = 1 - ratio;
            break;
          default:
            scale = 1;
        }
        frame.data.map(d => this.dataUpdate(d, {
          opacity: opacity,
          scale: scale,
        }))
      }
    }

    // var step = this.layout.sliders[0].steps[frames.idx];
    // if (step) {
    //   this._animationControllerService.frameLabel = step.label;
    // }
  }

  updateCameraPosition() {
    var position = this._animationControllerService.camera.position;
    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.camera.position.z = position.z;
    this.camera.lookAt(this.scene.position);
  }

  moveCamera() {
    var camera = this._animationControllerService.camera;
    var position = this._animationControllerService.camera.position;
    camera.rotation.theta += camera.rotation.speed;
    camera.rotation.theta = camera.rotation.theta % 360;
    var thetaRad = THREE.Math.degToRad(camera.rotation.theta)
    position.y = camera.distance / 2 * Math.sin(thetaRad);
    position.z = camera.distance * Math.sin(thetaRad / 2);
    this.camera.lookAt(this.scene.position);
  }

  onMouseDown() {
    this._animationControllerService.camera.control = false;
  }

  onDblClick() {
    this._animationControllerService.camera.rotation.theta = 0;
    this._animationControllerService.camera.control = true;
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.render(this.scene, this.camera);
  }

}
