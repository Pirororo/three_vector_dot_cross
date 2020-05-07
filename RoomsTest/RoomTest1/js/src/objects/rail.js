import * as THREE from '../../libs/three.module.js';

/**
 *　レールクラスです。
 */
export default class Rail extends THREE.Object3D {

    // /** 頂点情報 */
    // get points() {
    //     return this._points;
    // }


    // /**
    //  * コンストラクターです。
    //  * @constructor
    //  */
    constructor() {
      super();

      //レールの点 
      this._points = [];//なんだこのかきかたwwwww
      let radius = 10;
      const pointNUM = 362;

      for( let i = 0; i<pointNUM; i++){
        const point = new THREE.Vector3();
        point.x = radius * Math.sin(2* i* Math.PI/180);
        point.y = radius * Math.cos(i* Math.PI/180);
        point.z = radius * Math.sin(i* Math.PI/180);
        this._points.push(point);
      }

      //こっちの書き方でもいい
      // for( let i = 0; i<pointNUM; i++){
      //   let x = radius * Math.sin(2* i* Math.PI/180);
      //   let y = radius * Math.cos(i* Math.PI/180);
      //   let z = radius * Math.cos(i* Math.PI/180);
      //   this._points.push(new THREE.Vector3(x,y,z));
      // }

      const material = new THREE.LineBasicMaterial({
        color: 0xff0000,
      });
      const geometry = new THREE.Geometry();
      geometry.vertices = this._points;

      const line = new THREE.Line(geometry, material);
      this.add(line);//忘れずにかく

    //もしくはこっち
    //   this.line = new THREE.Line(geometry, material);
    //   this.add(this.line);//これ要る

    }
  
    /**
     * フレーム毎の更新をします。
     */
    update() {}
  }
  