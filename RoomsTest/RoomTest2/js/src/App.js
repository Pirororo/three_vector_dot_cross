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


    //Tween
    this.camPos = {x: 215, y: 315, z: -105};
    this._scene.camera.position.set(this.camPos.x,this.camPos.y,this.camPos.z);
    // var rndPos = (2*Math.random()-1)*100;//-100~100
    // this.camTarget= {x:rndPos, y:rndPos, z:rndPos};
    this.camTarget= {x:50, y:20, z:-100};

    this.tween = new TWEEN.Tween(this.camPos).to(this.camTarget, 1000).easing(TWEEN.Easing.Elastic.InOut).onUpdate(function(){
      console.log('update!!!!!!!!!');

      // this._scene.camera.position.x = this.camPos.x;
      // this._scene.camera.position.y = this.camPos.y;
      // this._scene.camera.position.z = this.camPos.z;
    }).delay(1500).start();//tween.start();も省略されてる



    //レンダラー
    this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // this._renderer.setClearColor(new THREE.Color(0xffffff));
    this._renderer.setClearColor(new THREE.Color(0x000000));
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
    
    //エフェクトパス（出力パスの前にかく）
    //グラデパス
    var colorify = new THREE.ShaderPass(THREE.ColorifyGradientShader);
    colorify.uniforms.color.value = new THREE.Color(0xffbeeb);
    colorify.uniforms.color2.value = new THREE.Color(0x93d9ff);
    colorify.uniforms.alpha = 0.8;
    colorify.enabled = true;
    //アンチエイリアスパス
    var FXAAShader = new THREE.ShaderPass(THREE.FXAAShader);
    FXAAShader.enabled = true;
    FXAAShader.uniforms.resolution.value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
    //ブラーパス
    var hBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    hBlur.enabled = true;
    hBlur.uniforms.h.value = 1 / window.innerHeight;
    var vBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    vBlur.enabled = true;
    vBlur.uniforms.v.value = 1 / window.innerWidth;
    //ブルームパス
    var bloomPass = new THREE.BloomPass(3, 25, 5.0, 256);
    bloomPass.enabled = true;

    //出力パス
    //コピーパス
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);//コピー
    effectCopy.renderToScreen = true;

    //グリッチパス
    var effectGlitch = new THREE.GlitchPass(256);
    effectGlitch.renderToScreen = true;
    effectGlitch.randX = THREE.Math.randInt( 360, 120 );

    

    //コンポーザーの定義
    this.composer = new THREE.EffectComposer(this._renderer);
    this.composer.renderTarget1.stencilBuffer = true;//?
    this.composer.renderTarget2.stencilBuffer = true;//?

    //コンポーザーに入れていく
    this.composer.addPass(renderPass1);//Scene1(Line)のレンダー
    this.composer.addPass(renderPass2);//Scene2(Plate)のレンダー


    // this.composer.addPass(FXAAShader);
    this.composer.addPass(colorify);//Scene2(Plate)のマスクのエフェクト


    // this.composer.addPass(scene1Mask);//Scene2(Plate)のマスクここから
    this.composer.addPass(bloomPass);
    this.composer.addPass(FXAAShader);
    // this.composer.addPass(clearMask);//Scene2(Plate)のマスクここから

    // this.composer.addPass(scene2Mask);//Scene2(Plate)のマスクここから
    // // this.composer.addPass(FXAAShader);
    // this.composer.addPass(colorify);//Scene2(Plate)のマスクのエフェクト
    // this.composer.addPass(clearMask);//Scene2(Plate)のマスクここから


    // this.composer.addPass(effectCopy);

    // this.composer.addPass(hBlur);
    // this.composer.addPass(vBlur);

    this.composer.addPass(effectGlitch);


    var controls = new function () {

        this.select = 'Colorify';

        //グラデパス
        this.color = 0xff3c47;
        this.color2 = 0x00ffd1;

        //ブルームパス
        this.strength = 0.1;
        this.kernelSize = 5;
        this.sigma = 1.0;
        this.resolution = 256;

        // this.rotate = false;

        this.changeColor = function () {
            colorify.uniforms.color.value = new THREE.Color(controls.color);
        };
        this.changeColor2 = function () {
            colorify.uniforms.color2.value = new THREE.Color(controls.color2);
        };

        this.updateEffectBloom = function () {
            bloomPass.strength = controls.strength, 
            console.log(bloomPass.strength);
            bloomPass.kernelSize = controls.kernelSize, 
            bloomPass.sigma = controls.sigma,
            bloomPass.resolution = controls.resolution
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

    gui.add(controls, "select", [ "colorify" , 'BloomPass']).onChange(controls.switchShader);
    // gui.add(controls, "rotate");

    var clFolder = gui.addFolder("Colorify");
    clFolder.addColor(controls, "color").onChange(controls.changeColor);
    clFolder.addColor(controls, "color2").onChange(controls.changeColor2);

    var bpFolder = gui.addFolder("BloomPass");
    bpFolder.add(controls, "strength", 1, 10).onChange(controls.updateEffectBloom);
    bpFolder.add(controls, "kernelSize", 1, 100).onChange(controls.updateEffectBloom);
    bpFolder.add(controls, "sigma", 1, 10).onChange(controls.updateEffectBloom);
    bpFolder.add(controls, "resolution", 0, 1024).onChange(controls.updateEffectBloom);



    // フレーム毎の更新
    this._update();

    // this.camSwitch = "mainCam";

  }




  /**
  * フレーム毎の更新をします。
  */
  _update() {

    // // ワールド座標を取得
    // const world = this._scene.camera.getWorldPosition();
    // console.log(world);

    this._stats.update();
    // TWEEN.update();

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