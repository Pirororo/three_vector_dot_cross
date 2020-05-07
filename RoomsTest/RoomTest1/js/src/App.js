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
    //この中からconstructer外部のmethodを呼び出すためにはbindする必要がある
    this._update = this._update.bind(this);
    this. handleMouseMove = this.handleMouseMove.bind(this);
    this._resize = this._resize.bind(this);

    // DOM
    this._wrapper = document.getElementById('app');//あれ？#いらない？canvasじゃなくてdivタグにかいてるのはなぜ？

    // マウス座標管理用のベクトルを作成
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


    ////カラーチェンジ：[box] 成功。
    // // マウスとの交差を調べたいものは配列に格納する
    // const floorsize = 10;
    // const geometry = new THREE.BoxBufferGeometry(floorsize, 1, floorsize);
    // // const geometry = new THREE.PlaneBufferGeometry(50, 50);
    
    // this.meshList = [];
    // const xMax = 5;
    // const zMax = 4;

    // for (let i = 0; i < xMax; i++) {
    //   for (let j = 0; j < zMax; j++) {
    //   const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    //   const floorPos = floorsize +5;
    //   const mesh = new THREE.Mesh(geometry, material);
    //   mesh.position.x = floorPos *i - ((floorPos*xMax)/2);
    //   mesh.position.y = 0;
    //   mesh.position.z = floorPos* j - ((floorPos*zMax)/2);
    //   // mesh.rotation.x = Math.random() * 2 * Math.PI;
    //   this._scene.add(mesh);

    //   // 配列に保存
    //   this.meshList.push(mesh);
    //   }
    // }

    ////カラーチェンジ：[car] 成功。「.body」なしはだめ。car.jsで「this.body」にしないとだめ。
    this.meshList = [];
    this.meshList.push(this._scene._car.body);
    this.meshList.push(this._scene._car2.body);
    console.log(this.meshList.length);//ちゃんと２個はいってる

    ////カラーチェンジ：[rail] これはうまくいかなかった。Materialの種類の問題かも
    // this.meshList = [];
    // this.meshList.push(this._scene._rail);
    // console.log(this.meshList.length);//ちゃんと２個はいってる


    // レイキャストを作成
    this.raycaster = new THREE.Raycaster();


    window.addEventListener('mousemove', this.handleMouseMove, false);

    // フレーム毎の更新
    this._update();

    console.log("ok");

  }




  /**
     * フレーム毎の更新をします。
     */
  _update() {

    requestAnimationFrame(this._update);
    // シーンの更新
    this._scene.update();
    // 描画
    this._renderer.render(this._scene, this._scene.camera);




    // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
    this.raycaster.setFromCamera(this.mouse, this._scene.camera);

    // その光線とぶつかったオブジェクトを得る
    const intersects = this.raycaster.intersectObjects(this.meshList);
    console.log(intersects.length);//0



    this.meshList.map(mesh => {
      // 交差しているオブジェクトが1つ以上存在し、
      // 交差しているオブジェクトの1番目(最前面)のものだったら
      if (intersects.length > 0 && mesh === intersects[0].object) {
      // 色を赤くする
        mesh.material.color.setHex(0xff0000);
        console.log("okMeshIf");
      } else {
        // それ以外は元の色にする
        mesh.material.color.setHex(0xffffff);
      }
    });

  }

  /**
  * マウスイベント
  */
  handleMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  }

  /**
   * リサイズ
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