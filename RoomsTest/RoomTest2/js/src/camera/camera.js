// import * as THREE from '../../libs/three.module.js';

export class Camera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    // super(45, window.innerWidth / window.innerHeight, 10, 500);
    super(45, window.innerWidth / window.innerHeight, 1,  1000);
    // this.lookAt(new THREE.Vector3(0, 0, 0));
  }

  /**
   * 毎フレームの更新をかけます。
   */
  update() {
    // 原点に注目
    this.lookAt(new THREE.Vector3(0, 0, 0));//これ大事！！！！！
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
