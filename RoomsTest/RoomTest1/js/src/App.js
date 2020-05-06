import * as THREE from '../libs/three.module.js';
/**
 * メインアプリクラスです。
 */

export class App{
//  export default class App{
    /**
   * @constructor
   * @param sceneInstance
   */
  constructor(sceneInstance){
    this._update = this._update.bind(this);//？
    this._resize = this._resize.bind(this);//？

    // DOM
    this._wrapper = document.getElementById('app');//あれ？#いらない？canvasじゃなくてdivタグにかいてるのはなぜ？

    // マウス座標管理用のベクトルを作成
    // const mouse = new THREE.Vector2();
    this.mouse = new THREE.Vector2();
    
    // シーン
    this._scene = sceneInstance;

    //レンダラー
    this._renderer = new THREE.WebGLRenderer({ antialias: false });//？
    this._renderer.setClearColor(0x000000);
    this._renderer.setPixelRatio(1);
    this._wrapper.appendChild(this._renderer.domElement);//'app'のタグ内にレンダラーのdomElementを追加する


    // リサイズ
    this._resize();
    window.addEventListener('resize', this._resize);

    // マウスとの交差を調べたいものは配列に格納する
    const geometry = new THREE.BoxBufferGeometry(50, 50, 50);
    // const meshList = [];
    this.meshList = [];
    for (let i = 0; i < 200; i++) {
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 800;
      mesh.position.y = (Math.random() - 0.5) * 800;
      mesh.position.z = (Math.random() - 0.5) * 800;
      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      mesh.rotation.z = Math.random() * 2 * Math.PI;
      // scene.add(mesh);
      this._scene.add(mesh);

      // 配列に保存
      // meshList.push(mesh);
      this.meshList.push(mesh);
    }

    // レイキャストを作成
    // const raycaster = new THREE.Raycaster();
    this.raycaster = new THREE.Raycaster();

    // canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleMouseMove);

    // フレーム毎の更新
    this._update();

    function handleMouseMove(event) {
      const x = event.clientX;
      const y = event.clientY;
      // const xu = 50;
      // const y = 100;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.mouse.x = (x / w) * 2 - 1;
      this.mouse.y = -(y / h) * 2 + 1;
      // this.mouse.x = 100;
      // this.mouse.y = 200;
    }
  }

  _update() {

    // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
    this.raycaster.setFromCamera(this.mouse, this._scene.camera);

    // その光線とぶつかったオブジェクトを得る
    // const intersects = raycaster.intersectObjects(meshList);
    const intersects = this.raycaster.intersectObjects(this.meshList);

    // meshList.map(mesh => {
    this.meshList.map(mesh => {
      // 交差しているオブジェクトが1つ以上存在し、
      // 交差しているオブジェクトの1番目(最前面)のものだったら
      if (intersects.length > 0 && mesh === intersects[0].object) {
        // 色を赤くする
        mesh.material.color.setHex(0xff0000);
      } else {
        // それ以外は元の色にする
        mesh.material.color.setHex(0xffffff);
      }
    });


    requestAnimationFrame(this._update);
    // シーンの更新
    this._scene.update();
    // 描画
    this._renderer.render(this._scene, this._scene.camera);

  }

  /**
   * リサイズをかけます。
   */
  _resize() {
    const width = this._wrapper.clientWidth;
    const height = this._wrapper.clientHeight;
    this._renderer.domElement.setAttribute('width', String(width));
    this._renderer.domElement.setAttribute('height', String(height));
    this._renderer.setPixelRatio(window.devicePixelRatio || 1.0);
    this._renderer.setSize(width, height);
    this._scene.camera.aspect = width / height;
    this._scene.camera.updateProjectionMatrix();
  }

}