// import * as THREE from '../../libs/three.module.js';

export class Camera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {

    
    // super(45, window.innerWidth / window.innerHeight, 10, 500);
    super(45, window.innerWidth / window.innerHeight, 1,  1000);
    // this._easing = this._easing.bind(this);

    this.frame =0;

    this.camPos = new THREE.Vector3(215, 180, 150);
    this.camTarget = new THREE.Vector3(50, 20,-100);
    
    // // //単純な動きならこっちの書き方のほうがみやすいかも
    // // //ここから
    // let camPos = {x: 215, y: 180, z: 150};
    // this.position.set(camPos.x,camPos.y,camPos.z);

    // // var rndPos = (2*Math.random()-1)*100;//-100~100
    // // this.camTarget= {x:rndPos, y:rndPos, z:rndPos};
    // let camTarget= {x:50, y:20, z:-100};


    // this.tween = new TWEEN.Tween(camPos).to(camTarget, 1000).easing(TWEEN.Easing.Elastic.InOut).onUpdate(function(){
    // console.log('update');
    // this.position.x = camPos.x;
    // this.position.y = camPos.y;
    // this.position.z = camPos.z;
    // }).delay(1500).start();//tween.start();も省略されてる
    // //ここまで


  }

  // _easing(){
  //     let camPos = this.getWorldPosition();
  //     console.log(camPos)
  //     let camTarget = new THREE.Vector3(
  //       (2*Math.random()-1)*150,
  //       (2*Math.random()-1)*150,
  //       (2*Math.random()-1)*150
  //     );//-150~150
  //     camPos += (camTarget-camPos)*0.02;
  //     this.position.set(camPos.x,camPos.y,camPos.z);
  //     // 原点に注目
  //     this.lookAt(new THREE.Vector3(0, 0, 0));//これ大事！！！！
  // }


  /**
   * 毎フレームの更新をかけます。
   */
  update() {

    // TWEEN.update();

    this.frame += 1;
    // this.camPos += (this.camTarget - this.camPos)*0.02;
    this.camPos.x += (this.camTarget.x - this.camPos.x)*0.01;
    this.camPos.y += (this.camTarget.y - this.camPos.y)*0.01;
    this.camPos.z += (this.camTarget.z - this.camPos.z)*0.01;

    this.position.set(this.camPos.x,this.camPos.y,this.camPos.z);
    console.log(this.camPos.x);


    // 原点に注目
    this.lookAt(new THREE.Vector3(0, 0, 0));//これ大事！！！！

    if(this.frame% 600 == 0){
      this.camTarget = new THREE.Vector3(
        (2*Math.random()-1)*350,
        (2*Math.random()-1)*350,
        (2*Math.random()-1)*350
      );//-150~150
      this.camPos = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
      
    }

  }
}

export class RoomCamera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 10, 500);
  }

  /**
   * 毎フレームの更新をかけます。
   */
  update() {}
}

export class MoveCamera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 10, 500);

  }

  /**
   * 毎フレームの更新をかけます。
   */
  update() {}
}
