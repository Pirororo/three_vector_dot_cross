import * as THREE from '../../libs/three.module.js';
import Camera from '../camera/camera.js';
import Rail from '../objects/rail.js';
import Car from '../objects/car.js';


/**
 * ステップ２シーンクラスです。
 */
export default class Scene extends THREE.Scene {

    constructor(){

        super();
        this._frame = 0;//frame

    //   // 床
    //   const gridHelper = new THREE.GridHelper(50, 30);
    //   gridHelper.position.y = -10;
    //   this.add(gridHelper);


        //camera
        this.camera = new Camera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする
        this.camera.position.y = 10;
        this.camera.position.x = 10;
        this.camera.position.z = 30;


        // 環境光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.add(ambientLight);

        // 平行光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.add(directionalLight);

        //レール
        this._rail = new Rail();
        this._rail.position.set(0,0,0);
        this.add(this._rail);

        //車
        this._car = new Car();
        this._car.position.set(0,0,0);
        this._car.scale.multiplyScalar(0.5);
        // this._car.position.copy(this._rail.points[0]);//これのときはget points()関数の定義が必要
        this._car.position.copy(this._rail._points[0]);
        this.add(this._car);


    }

    update(){

        this.camera.update();//lookAtで中心みてる
        this._frame++;
        if (this._frame > 360) {
          this._frame = 0;
        }


        //これだとだめ、this._rail._points[n]自体ですでにVector3なので二重でVector3を宣言することになる
        // const currentPoint = new THREE.Vector3(this._rail._points[this._frame]);
        // const nextPoint = new THREE.Vector3(this._rail._points[this._frame +1]);
        //こっちならok
        const currentPoint = this._rail._points[this._frame];
        const nextPoint = this._rail._points[this._frame +1];
        const normal = this._getNormal(currentPoint,nextPoint);

        // トラックの位置を修正
        this._car.position.copy(this._rail._points[this._frame]);
        this._car.up.set(normal.x, normal.y, normal.z);
        this._car.lookAt(this._rail._points[this._frame + 1]);


        // // _pointsではなくpointsのままのもの
        // const curentPoint = this._rail.points[this._frame];
        // const nextPoint = this._rail.points[this._frame +1];
        // const normal = this._getNormal(curentPoint,nextPoint);

        // this._car.position.copy(this._rail.points[this._frame]);
        // this._car.up.set(normal.x, normal.y, normal.z);
        // this._car.lookAt(this._rail.points[this._frame + 1]);
    }


    _getNormal(curretP, nextP) {
        const NormalVec = curretP
                    .clone()
                    .sub(nextP)
                    .normalize()
                    .cross(new THREE.Vector3(0,0,-1));
        return NormalVec;
    }


}
