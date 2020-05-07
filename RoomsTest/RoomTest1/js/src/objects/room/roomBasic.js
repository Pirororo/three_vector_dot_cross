import * as THREE from '../../../libs/three.module.js';

/**
 *　レールクラスです。
 */
export default class RoomBasic extends THREE.Object3D {


    // /**
    //  * コンストラクターです。
    //  * @constructor
    //  */
    constructor() {
      super();

        const floorsize = 10;
        const geometry = new THREE.BoxBufferGeometry(floorsize, 1, floorsize);
        // const geometry = new THREE.PlaneBufferGeometry(50, 50);
        
        this.meshList = [];
        const xMax = 5;
        const zMax = 4;

        for (let i = 0; i < xMax; i++) {
            for (let j = 0; j < zMax; j++) {
            const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

            const floorPos = floorsize +5;
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = floorPos *i - ((floorPos*xMax)/2);
            mesh.position.y = 0;
            mesh.position.z = floorPos* j - ((floorPos*zMax)/2);
            // mesh.rotation.x = Math.random() * 2 * Math.PI;
            // this._scene.add(mesh);
            this.add(mesh);


            // 配列に保存
            this.meshList.push(mesh);
            }
        }

        // //レールの点 
        // this._points = [];//なんだこのかきかたwwwww
        // let radius = 10;
        // const pointNUM = 362;

        // for( let i = 0; i<pointNUM; i++){
        //     const point = new THREE.Vector3();
        //     point.x = radius * Math.sin(2* i* Math.PI/180);
        //     point.y = radius * Math.cos(i* Math.PI/180);
        //     point.z = radius * Math.sin(i* Math.PI/180);
        //     this._points.push(point);
        // }

        // const material = new THREE.LineBasicMaterial({
        //     color: 0xff0000,
        // });
        // const geometry = new THREE.Geometry();
        // geometry.vertices = this._points;

        // const line = new THREE.Line(geometry, material);
        // this.add(line);//忘れずにかく

        // //もしくはこっち
        // //   this.line = new THREE.Line(geometry, material);
        // //   this.add(this.line);//これ要る

    }
  
    /**
     * フレーム毎の更新をします。
     */
    update() {}
  }
  