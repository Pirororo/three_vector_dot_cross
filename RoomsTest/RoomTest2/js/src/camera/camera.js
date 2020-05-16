// import * as THREE from '../../libs/three.module.js';

export class Camera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    // super(45, window.innerWidth / window.innerHeight, 10, 500);
    super(45, window.innerWidth / window.innerHeight, 1,  1000);

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


  /**
   * 毎フレームの更新をかけます。
   */
  update() {
    // 原点に注目
    this.lookAt(new THREE.Vector3(0, 0, 0));//これ大事！！！！！
    // TWEEN.update();

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
