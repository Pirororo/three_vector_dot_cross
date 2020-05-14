// import * as THREE from '../libs/three.module.js';

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
    // this.cameraChange = this.cameraChange.bind(this);
    // this.handleMouseMove = this.handleMouseMove.bind(this);
    this._resize = this._resize.bind(this);
    this._initStats = this._initStats.bind(this);



    //fps表示
    this._stats = this._initStats();
    
    // // マウス座標管理用のベクトルを作成
    // this.mouse = new THREE.Vector2();
    
    // シーン
    this._scene = sceneInstance;

    //カメラ
    this.orbitControls = new THREE.OrbitControls(this._scene.camera);
    this.orbitControls.autoRotate = false;
    // this.orbitControls.enableDamping = true;
    // this.orbitControls.dampingFactor = 0.2;
    // this.clock = new THREE.Clock();

    //レンダラー
    this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this._renderer.setClearColor(new THREE.Color(0x000000));//もとはこっち
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setPixelRatio(1);
    // this._renderer.shadowMap.enabled = true;


    // DOMを追加////あとで簡略化する！順番も
    this._wrapper = document.getElementById('WebGL-output');
    this._wrapper.appendChild(this._renderer.domElement);
    // document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);


    // リサイズ
    this._resize();
    window.addEventListener('resize', this._resize);


    // // マウスとの交差を調べたいものは配列に格納する
    // this.meshList = this._scene.meshList;
    // console.log(this.meshList.length);//22個
    // // レイキャストを作成
    // this.raycaster = new THREE.Raycaster();
    // window.addEventListener('mousemove', this.handleMouseMove);
    // window.addEventListener('click', this.cameraChange, false);


    // シェーダー
    //レンダーパス
    var renderPass1 = new THREE.RenderPass(this._scene.scene1, this._scene.camera);
    renderPass1.clear = true;//Lineは線が更新されていくのでtrueにする、falseだと線最初から全部のこっちゃう
    var renderPass2 = new THREE.RenderPass(this._scene.scene2, this._scene.camera);
    renderPass2.clear = false;//trueで色がでる
    //**********renderPass両方falseだとopasity0みたいに明るくなりすぎる、ライト二重？ */
    
    //マスクパス、クリアマスクパス
    let scene1Mask = new THREE.MaskPass(this._scene.scene1, this._scene.camera);
    let scene2Mask = new THREE.MaskPass(this._scene.scene2, this._scene.camera);
    let clearMask = new THREE.ClearMaskPass();
    
    //エフェクトパス
    var colorify = new THREE.ShaderPass(THREE.ColorifyGradientShader);
    colorify.uniforms.color.value = new THREE.Color(0xff3c47);
    colorify.uniforms.color2.value = new THREE.Color(0x00ffd1);
    // colorify.enabled = false;
    colorify.enabled = true;

    var FXAAShader = new THREE.ShaderPass(THREE.FXAAShader);
    FXAAShader.enabled = true;
    FXAAShader.uniforms.resolution.value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);

    //コピーパス
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);//コピー
    effectCopy.renderToScreen = true;

    //グリッチパス
    var effectGlitch = new THREE.GlitchPass(32);
    effectGlitch.renderToScreen = true;
    effectGlitch.randX = THREE.Math.randInt( 120, 60 );


    //コンポーザーの定義
    this.composer = new THREE.EffectComposer(this._renderer);
    this.composer.renderTarget1.stencilBuffer = true;//?
    this.composer.renderTarget2.stencilBuffer = true;//?

    //コンポーザーに入れていく
    this.composer.addPass(renderPass1);//Scene1(Line)のレンダー
    this.composer.addPass(renderPass2);//Scene2(Plate)のレンダー

    this.composer.addPass(FXAAShader);
    this.composer.addPass(colorify);//Scene2(Plate)のマスクのエフェクト

    // this.composer.addPass(scene1Mask);//Scene2(Plate)のマスクここから
    // this.composer.addPass(FXAAShader);
    // this.composer.addPass(clearMask);//Scene2(Plate)のマスクここから

    // this.composer.addPass(scene2Mask);//Scene2(Plate)のマスクここから
    // // this.composer.addPass(FXAAShader);
    // this.composer.addPass(colorify);//Scene2(Plate)のマスクのエフェクト
    // this.composer.addPass(clearMask);//Scene2(Plate)のマスクここから


    // this.composer.addPass(effectCopy);
    this.composer.addPass(effectGlitch);


    var controls = new function () {

        this.select = 'Colorify';
        this.color = 0xff3c47;
        this.color2 = 0x00ffd1;

        // this.rotate = false;

        this.changeColor = function () {
            colorify.uniforms.color.value = new THREE.Color(controls.color);
        };
        this.changeColor2 = function () {
            colorify.uniforms.color2.value = new THREE.Color(controls.color2);
        };

        // this.switchShader = function () {
        //     switch (controls.select) {
        //         case 'none' :
        //         {
        //             enableShader();
        //             break;
        //         }

        //         case 'colorify' :
        //         {
        //             enableShader(colorify);
        //             break;
        //         }
        //     }
        // }

        // let enableShader = new function(shader) {
        //     // we're not interested in the first or the last one
              //////passが認識されない〜〜
        //     for (var i = 1; i < this.composer.passes.length - 1; i++) {
        //         if (this.composer.passes[i] == shader) {
        //           this.composer.passes[i].enabled = true;
        //         } else {
        //           this.composer.passes[i].enabled = false;
        //         }
        //     }
        // }

    };


    var gui = new dat.GUI();

    gui.add(controls, "select", [ "colorify" , 'none']).onChange(controls.switchShader);
    // gui.add(controls, "rotate");

    var clFolder = gui.addFolder("Colorify");
    clFolder.addColor(controls, "color").onChange(controls.changeColor);
    clFolder.addColor(controls, "color2").onChange(controls.changeColor2);


    // フレーム毎の更新
    this._update();

    // this.camSwitch = "mainCam";

  }




  /**
  * フレーム毎の更新をします。
  */
  _update() {

    // ワールド座標を取得
    const world = this._scene.camera.getWorldPosition();
    console.log(world);

    this._stats.update();

    // //sphere.rotation.y=step+=0.01;
    // var delta = this.clock.getDelta();
    // this.orbitControls.update(delta);

    this._renderer.autoClear = false;//これ大事〜！trueだと色が毎回背景白にクリアされちゃう

    // シーンの更新
    this._scene.update();

    requestAnimationFrame(this._update);
    this.composer.render();
    // this.composer.render(delta);
    // this._renderer.render(this._scene.scene1, this._scene.camera);

    // // カメラを切り替え
    // if(this.camSwitch == "mainCam"){
    //   this._renderer.render(this._scene, this._scene.camera);
    // }else if(this.camSwitch == "roomCam"){
    //   this._renderer.render(this._scene, this._scene.roomCamera);
    // }else if(this.camSwitch == "moveCam"){
    //   this._renderer.render(this._scene, this._scene.moveCamera);
    // }


    // // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
    // this.raycaster.setFromCamera(this.mouse, this._scene.camera);

    // // その光線とぶつかったオブジェクトを得る
    // const intersects = this.raycaster.intersectObjects(this.meshList);
    // console.log(intersects.length);


    // this.meshList.map(mesh => {
    //   // 交差しているオブジェクトが1つ以上存在し、
    //   // 交差しているオブジェクトの1番目(最前面)のものだったら
    //   if (intersects.length > 0 && mesh === intersects[0].object) {
    //     mesh.material.transparent = true;
    //     mesh.material.opacity = 0.8;
    //     console.log("okMeshIf");
    //   } else {
    //     mesh.material.transparent = true;
    //     mesh.material.opacity = 0.4;
    //   }
    // });

  }

  // /**
  // * マウスイベント
  // */
  // handleMouseMove( event ) {
  //   // calculate mouse position in normalized device coordinates
  //   // (-1 to +1) for both components
  //   this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  //   this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  //   console.log("okMouse");
  // }

  // cameraChange() {

  //   console.log("okClick");

  //   if(this.camSwitch == "mainCam"){
  //     // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
  //     this.raycaster.setFromCamera(this.mouse, this._scene.camera);

  //     // その光線とぶつかったオブジェクトを得る
  //     const intersects = this.raycaster.intersectObjects(this.meshList);
  //     console.log(intersects.length);


  //     this.meshList.map( mesh => {
  //       // 交差しているオブジェクトが1つ以上存在し、
  //       // 交差しているオブジェクトの1番目(最前面)のものだったら
  //       if (intersects.length > 0 && mesh === intersects[0].object) {

  //         // if (mesh == this._scene._car.body){

  //         //   this.camSwitch = "moveCam";

  //         // }else{

  //           this.camSwitch = "roomCam";

  //           this._scene.roomCamera.position.copy(intersects[0].object);
  //           // //上のやつをsetつかうときは下のように取り出してかく
  //           // this._scene.roomCamera.position.set(intersects[0].object.getWorldPosition().x,intersects[0].object.getWorldPosition().y,intersects[0].object.getWorldPosition().z);
            
  //           this._scene.roomCamera.position.y += 5;
  //           this._scene.roomCamera.position.z += 15;
  //           this._scene.roomCamera.lookAt(intersects[0].object.getWorldPosition());

  //         // }

  //         console.log("okCamera");
  //       }
  //     });
  //   }else{
  //     this.camSwitch = "mainCam";
  //   }
  // }

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

  _initStats() {

    this._stats = new Stats();
    this._stats.setMode(0); // 0: fps, 1: ms


    // Align top-left
    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.left = '0px';
    this._stats.domElement.style.top = '0px';

    document.getElementById("Stats-output").appendChild(this._stats.domElement);

    return this._stats;
}

}