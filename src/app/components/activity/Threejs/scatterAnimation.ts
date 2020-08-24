import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as STATS from 'stats.js';

import { ActivityAnimationGraph } from './activityAnimationGraph';


export class ScatterAnimation {
  graph: ActivityAnimationGraph;                  // parent
  id: string;

  private _animationFrameIdx: number;
  private _camera: THREE.PerspectiveCamera;
  private _controls: OrbitControls;
  private _geometry: THREE.SphereGeometry;
  private _grid: THREE.GridHelper;
  private _scene: THREE.Scene;
  private _stats: STATS;
  private _useStats: boolean = false;
  public renderer: THREE.WebGLRenderer;


  constructor(graph: ActivityAnimationGraph, id: string) {
    this.graph = graph;
    this.id = id;

    if (this._useStats) {
      this._stats = new STATS();
      this._stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this._stats.dom);
    }

    this.init()
  }

  get container(): any {
    return document.getElementById(this.id);
  }

  get aspect(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  init(): void {
    console.log('Init animation scatter scene');

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xfefefe);

    this._camera = new THREE.PerspectiveCamera(5, this.aspect, 1, 10000);
    this.updateCameraPosition();
    this._scene.add(this._camera);

    this._grid = new THREE.GridHelper(1, 10);
    this._grid.position.x = .5;
    this._grid.geometry.rotateZ(Math.PI / 2);
    this._scene.add(this._grid);

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.resize();
    this.container.appendChild( this.renderer.domElement );

    this._controls = new OrbitControls(this._camera, this.renderer.domElement);
    this._controls.rotateSpeed = 1;
    this._controls.zoomSpeed = 1.2;
    this._controls.enableKeys = false;

    this._geometry = new THREE.SphereGeometry(.002);
    this.animate();
  }

  clear() {
    this.container.removeChild( this.renderer.domElement );
    while (this._scene.children.length > 0) {
      this._scene.remove(this._scene.children[0]);
    }
  }

  stop(): void {
    this.graph.stop();
    cancelAnimationFrame(this._animationFrameIdx);
  }

  animate(): void {
    console.log('Animate scatter');
    let _this = this;
    function render(): void {
      const framesLength: number = _this.graph.frames.length;
      const frames: any = _this.graph.config.frames;
      const camera: any = _this.graph.config.camera;

      setTimeout(() => {
        _this._animationFrameIdx = requestAnimationFrame(render);

        if (_this._stats) {
          _this._stats.begin();
        }

        const framesSpeed: number = frames.speed;
        if (framesSpeed !== 0) {
          frames.idx = (frames.idx + framesSpeed * frames.windowSize + framesLength) % framesLength;
          _this.frameUpdate()
        }

        if (camera.control) {
          if (camera.rotation.speed > 0) {
            _this.moveCamera()
          }
          _this.updateCameraPosition()
        }

        if (_this._stats) {
          _this._stats.end();
        }

      }, 1000 / frames.rate);

      _this.renderer.render(_this._scene, _this._camera);
    }

    render()
    this.frameUpdate()
  }

  frameUpdate(): void {
    if (this.graph.frames.length === 0) return

    this._scene.children.slice(2).map(object => this._scene.remove(object));

    let frames: any = this.graph.config.frames;
    let nSamples: number = this.graph.endtime * frames.sampleRate;
    let frame: any;
    // frames.idx = (frames.idx + nSamples) % nSamples;
    for (let frameIdx = 0; frameIdx < frames.windowSize; frameIdx++) {
      frame = this.graph.frames[frameIdx];
      if (frame) {
        frame.data.forEach(d => this.dataUpdate(d))
      }
    }

    let ratio: number;
    let scale: number;
    let opacity: number;
    const trail: any = this.graph.config.trail;
    for (let trailIdx = 0; trailIdx < trail.length; trailIdx++) {
      frame = this.graph.frames[frames.idx - trailIdx];
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
        frame.data.forEach(d => this.dataUpdate(d, {
          opacity: opacity,
          scale: scale,
        }))
      }
    }
  }

  dataUpdate(data: any, config: any = {}): void {
    if (data === undefined) return

    const extent: number[][] = this.graph.layout['extent'] || [[-.5, .5], [-.5, .5]];
    const ndim: number = extent.length;

    const opacity: number = config.hasOwnProperty('opacity') ? config['opacity'] : data['opacity'] || 1;
    const scale: number = this.graph.config.dotSize * (config['scale'] || 1);

    const frames: any = this.graph.config.frames;
    const trail: any = this.graph.config.trail;
    const ts: number = frames.idx / frames.sampleRate;

    for (let i = 0; i < data.x.length; i++) {
      const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: this.graph.color(data.color[i]), transparent: true, opacity: opacity });
      const object: THREE.Mesh = new THREE.Mesh(this._geometry, material);
      object.position.x = .5 - (trail.mode == 'temporal' ? ((ts - data.x[i]) / frames.windowSize) : 0);
      object.position.y = data.y[i];
      if (ndim > 2) {
        object.position.z = data.z[i];
      }
      if (scale != 1) {
        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;
      }
      this._scene.add(object);
    }
  }

  updateCameraPosition(): void {
    const position: any = this.graph.config.camera.position;
    this._camera.position.x = position.x;
    this._camera.position.y = position.y;
    this._camera.position.z = position.z;
    this._camera.lookAt(this._scene.position);
  }

  degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  moveCamera(): void {
    const camera: any = this.graph.config.camera;
    const position: any = this.graph.config.camera.position;
    camera.rotation.theta += camera.rotation.speed;
    camera.rotation.theta = camera.rotation.theta % 360;
    const thetaRad: number = this.degToRad(camera.rotation.theta)
    position.y = camera.distance / 2 * Math.sin(thetaRad);
    position.z = camera.distance * Math.sin(thetaRad / 2);
    this._camera.lookAt(this._scene.position);
  }

  disableCameraControl(): void {
    this.graph.config.camera.rotation.theta = 0;
    this.graph.config.camera.control = true;
  }

  enableCameraControl(): void {
    this.graph.config.camera.control = false;
  }

  resize(): void {
    this._camera.aspect = this.aspect;
    this._camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.render(this._scene, this._camera);
  }

}
