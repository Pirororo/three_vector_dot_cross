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
    this.cameraChange = this.cameraChange.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
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


    ////カラーチェンジ：[box]と[car] 成功。meshListをroomBasic内でつくることに成功。
    // // マウスとの交差を調べたいものは配列に格納する
    this.meshList = this._scene._roombasic.meshList;
    this.meshList.push(this._scene._car.body);
    this.meshList.push(this._scene._car2.body);
    // this.meshList.push(this._scene._car3.body);
    console.log(this.meshList.length);//22個


    // レイキャストを作成
    this.raycaster = new THREE.Raycaster();


    window.addEventListener('mousemove', this.handleMouseMove);

    window.addEventListener('click', this.cameraChange, false);

    // フレーム毎の更新
    this._update();

    console.log("ok");



    this.camSwitch = "mainCam";

  }




  /**
     * フレーム毎の更新をします。
     */
  _update() {

    requestAnimationFrame(this._update);
    // シーンの更新
    this._scene.update();
    // 描画
    
    if(this.camSwitch == "mainCam"){
      this._renderer.render(this._scene, this._scene.camera);
    }else if(this.camSwitch == "roomCam"){
      this._renderer.render(this._scene, this._scene.roomCamera);
    }else if(this.camSwitch == "moveCam"){
      this._renderer.render(this._scene, this._scene.moveCamera);
    }



    // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
    this.raycaster.setFromCamera(this.mouse, this._scene.camera);

    // その光線とぶつかったオブジェクトを得る
    const intersects = this.raycaster.intersectObjects(this.meshList);
    console.log(intersects.length);


    this.meshList.map(mesh => {
      // 交差しているオブジェクトが1つ以上存在し、
      // 交差しているオブジェクトの1番目(最前面)のものだったら
      if (intersects.length > 0 && mesh === intersects[0].object) {
        mesh.material.transparent = true;
        mesh.material.opacity = 0.8;
      } else {
        mesh.material.transparent = true;
        mesh.material.opacity = 0.4;
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

  cameraChange() {

    console.log("okClick");

    if(this.camSwitch == "mainCam"){
      // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
      this.raycaster.setFromCamera(this.mouse, this._scene.camera);

      // その光線とぶつかったオブジェクトを得る
      const intersects = this.raycaster.intersectObjects(this.meshList);
      console.log(intersects.length);


      this.meshList.map( mesh => {
        // 交差しているオブジェクトが1つ以上存在し、
        // 交差しているオブジェクトの1番目(最前面)のものだったら
        if (intersects.length > 0 && mesh === intersects[0].object) {

          if (mesh == this._scene._car.body){

            this.camSwitch = "moveCam";

          }else{

            this.camSwitch = "roomCam";

            // this._scene.roomCamera.position.copy(intersects[0].object);
            // //上のやつをsetつかうときは下のように取り出してかく
            this._scene.roomCamera.position.set(
              intersects[0].object.getWorldPosition().x,
              intersects[0].object.getWorldPosition().y,
              intersects[0].object.getWorldPosition().z
            );

            this._scene.roomCamera.position.y += 5;
            // this._scene.roomCamera.position.z += 15;

            // this._scene.roomCamera.lookAt(
            //   new THREE.Vector3(intersects[0].object.maru)
            // );
            this._scene.roomCamera.lookAt(new THREE.Vector3(0,0,0));

            // this._scene.roomCamera.lookAt(
            //   intersects[0].object.position.x,
            //   intersects[0].object.position.y,
            //   intersects[0].object.position.z
            // );

          }

          console.log("okCamera");
        }
      });

    }else{

      this.camSwitch = "mainCam";
    }
  
  }

  // // ワールド座標を取得
  // const world = targetMesh.getWorldPosition();

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