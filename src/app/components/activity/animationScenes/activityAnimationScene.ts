import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as STATS from 'stats.js';

import { ActivityAnimationGraph } from '../activityAnimationGraph';


export class ActivityAnimationScene {
  private _animationFrameIdx: number;
  private _camera: THREE.PerspectiveCamera;
  private _clippingPlanes: THREE.Plane[] = [];
  private _container: any;
  private _controls: OrbitControls;
  private _geometry: THREE.SphereGeometry;
  private _graph: ActivityAnimationGraph;                  // parent
  private _grid: THREE.GridHelper;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _stats: STATS;
  private _useStats = true;

  constructor(graph: ActivityAnimationGraph, containerId: string) {
    this._container = document.getElementById(containerId);
    this._graph = graph;

    this._animationFrameIdx = -1;
    this._camera = new THREE.PerspectiveCamera(5, 1, 1, 10000);
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._controls = new OrbitControls(
      this._camera,
      this._renderer.domElement
    );
    this._geometry = new THREE.SphereGeometry(0.002);
    this._grid = new THREE.GridHelper(1, 10);

    this._scene = new THREE.Scene();
    this._stats = new STATS();

    if (this._useStats) {
      this._stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this._stats.dom);
    }

    this.init();
  }

  get aspect(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  get container(): any {
    return this._container;
  }

  get geometry(): THREE.SphereGeometry {
    return this._geometry;
  }

  get graph(): ActivityAnimationGraph {
    return this._graph;
  }

  get scene(): THREE.Scene {
    return this._scene;
  }

  init(): void {
    console.log('Init animation scene');
    this._scene.background = new THREE.Color(0xfefefe);

    this.updateCameraPosition();
    this._scene.add(this._camera);
    this.addAxesHelper();
    this.addHelpers();

    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.resize();
    this.container.appendChild(this._renderer.domElement);

    this._controls.rotateSpeed = 1;
    this._controls.zoomSpeed = 1.2;
    this._controls.enableKeys = false;

    this.animate();
  }

  update(): void {
    console.log('Update animation scene');
    this.stop();
    this.animate();
    this.graph.play();
  }

  addAxesHelper(): void {
    const axesHelper: THREE.AxesHelper = new THREE.AxesHelper(0.1);
    this._scene.add(axesHelper);
  }

  addHelpers(): void {
    this._clippingPlanes.push(new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1));
    this._clippingPlanes.push(new THREE.Plane(new THREE.Vector3(0, -1, 0), 1));
    this._clippingPlanes.push(new THREE.Plane(new THREE.Vector3(0, 0, -1), 1));

    const helpers: THREE.Group = new THREE.Group();
    helpers.add(new THREE.PlaneHelper(this._clippingPlanes[0], 2, 0xff0000));
    helpers.add(new THREE.PlaneHelper(this._clippingPlanes[1], 2, 0x00ff00));
    helpers.add(new THREE.PlaneHelper(this._clippingPlanes[2], 2, 0x0000ff));
    helpers.visible = false;
    this.scene.add(helpers);
  }

  addGrid(): void {
    const flat = this._graph.numDimensions === 2;
    const grid: THREE.Group = new THREE.Group();
    const divisions = 10;
    const scale: any = { x: 1, y: 1, z: 1 };

    if (!flat) {
      const gridX: THREE.GridHelper = new THREE.GridHelper(1, divisions);
      gridX.geometry.rotateZ(Math.PI / 2);
      gridX.position.x = - scale.x / 2;
      grid.add(gridX);
    }

    const gridY: THREE.GridHelper = new THREE.GridHelper(1, divisions);
    gridY.position.y = flat ? 0 : (-scale.y / 2);
    grid.add(gridY);

    if (!flat) {
      const gridZ: THREE.GridHelper = new THREE.GridHelper(1, divisions);
      gridZ.geometry.rotateX(Math.PI / 2);
      gridZ.position.z = - scale.z / 2;
      grid.add(gridZ);
    }
    this._scene.add(grid);
  }

  clear() {
    try {
      this.container.removeChild(this._renderer.domElement);
    } catch { }
    while (this._scene.children.length > 0) {
      this._scene.remove(this._scene.children[0]);
    }
  }

  stop(): void {
    console.log('Stop animation');
    this.graph.stop();
    cancelAnimationFrame(this._animationFrameIdx);
  }

  animate(): void {
    console.log('Start animation');
    const that = this;
    function render(): void {
      const framesLength: number = that._graph.frames.length;
      const frames: any = that._graph.config.frames;
      const camera: any = that._graph.config.camera;

      setTimeout(() => {
        that._animationFrameIdx = requestAnimationFrame(render);
      }, 1000 / 50);

      if (that._stats) {
        that._stats.begin();
      }

      const framesSpeed: number = frames.speed;
      if (framesSpeed !== 0) {
        that._graph.frameIdx =
          (that._graph.frameIdx +
            framesSpeed * frames.windowSize +
            framesLength) %
          framesLength;
        that.renderFrame();
      }

      if (false && that._graph.config.control) {
        if (camera.rotation.speed > 0) {
          that.moveCamera();
        }
        that.updateCameraPosition();
      }

      if (that._stats) {
        that._stats.end();
      }

      that._renderer.render(that._scene, that._camera);
    }

    render();
  }

  cleanScene(): void {
    this._scene.children
      .slice(3)
      .map((object: any) => this._scene.remove(object));
    this.addGrid();
  }

  renderFrame(): void {
  }

  updateCameraPosition(): void {
    const position: any = this.graph.config.camera.position;
    this._camera.position.x = position.x;
    this._camera.position.y = position.y;
    this._camera.position.z = position.z;
    this._camera.lookAt(this._scene.position);
  }

  degToRad(deg: number) {
    return deg * (Math.PI / 180);
  }

  moveCamera(): void {
    const camera: any = this.graph.config.camera;
    const position: any = this.graph.config.camera.position;
    camera.rotation.theta += camera.rotation.speed;
    camera.rotation.theta = camera.rotation.theta % 360;
    const thetaRad: number = this.degToRad(camera.rotation.theta);
    position.x = camera.distance / 2 * Math.sin(thetaRad);
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
    this._renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this._renderer.render(this._scene, this._camera);
  }

}
