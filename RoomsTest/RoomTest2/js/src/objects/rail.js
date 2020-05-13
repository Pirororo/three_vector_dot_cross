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
      this._points = [];
      let radius = 20;
      // const pointNUM = 362;//362は大丈夫なのに360だとだめだった！！！！！！！！！！！！！

      // for( let i = 0; i<pointNUM; i++){
      //   const point = new THREE.Vector3();
      //   point.x = radius * Math.sin(2* i* Math.PI/180);
      //   point.y = radius/4 * Math.cos(i* Math.PI/180);
      //   point.z = radius * Math.sin(i* Math.PI/180);
      //   this._points.push(point);
      // }

      //トロッコ遅くしてみた
      const pointNUM = 722;

      for( let i = 0; i<pointNUM; i++){
        const point = new THREE.Vector3();
        point.x = radius * Math.sin(2* i* Math.PI/180/2);
        point.y = radius/4 * Math.cos(i* Math.PI/180/2)   + 5;
        point.z = radius * Math.sin(i* Math.PI/180/2);
        this._points.push(point);
      }





      //こっちの書き方でもいい
      // for( let i = 0; i<pointNUM; i++){
      //   let x = radius * Math.sin(2* i* Math.PI/180);
      //   let y = radius * Math.cos(i* Math.PI/180);
      //   let z = radius * Math.cos(i* Math.PI/180);
      //   this._points.push(new THREE.Vector3(x,y,z));
      // }

      // const material = new THREE.LineBasicMaterial({
      const material = new THREE.LineBasicMaterial({
        color: 0xffff00,
      });
      const geometry = new THREE.Geometry();
      geometry.vertices = this._points;

      const line = new THREE.Line(geometry, material);
      this.add(line);//忘れずにかく

    // もしくはこっち
      // this.line = new THREE.Line(geometry, material);
      // this.add(this.line);//これ要る

    }
  
    /**
     * フレーム毎の更新をします。
     */
    update() {}
  }
  