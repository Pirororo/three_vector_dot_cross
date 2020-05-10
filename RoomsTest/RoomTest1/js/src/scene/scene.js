import * as THREE from '../../libs/three.module.js';
import {Camera, RoomCamera, MoveCamera} from '../camera/camera.js';
import Rail from '../objects/rail.js';
import Car from '../objects/car.js';
import RoomBasic from '../objects/room/roomBasic.js';

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


        //カメラ３種
        //mainCamera
        this.camera = new Camera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする
        this.camera.position.x = 10;
        this.camera.position.y = 120;
        this.camera.position.z = 140;

        //roomCamera
        this.roomCamera = new RoomCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする

        //moveCamera
        this.moveCamera = new MoveCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする



        // 環境光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.add(ambientLight);

        // 平行光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.add(directionalLight);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(20, 20, 20);
        this.add(spotLight);

        //レール
        this._rail = new Rail();
        this._rail.position.set(0,0,0);
        this.add(this._rail);

        //車
        this._car = new Car();
        this._car.position.set(0,0,0);
        this._car.scale.multiplyScalar(1.5);
        // this._car.position.copy(this._rail.points[0]);//これのときはget points()関数の定義が必要
        this._car.position.copy(this._rail._points[0]);
        this.add(this._car);

        //車2
        this._car2 = new Car();
        this._car2.position.set(0,0,0);
        this._car2.scale.multiplyScalar(1);
        this.add(this._car2);

        // //車3
        // this._car3 = new Car();
        // this._car3.position.set(0,0,0);
        // // this._car3.scale.multiplyScalar(4);
        // this.add(this._car3);

        //部屋ベーシック
        this._roombasic= new RoomBasic();
        this._roombasic.position.set(0,0,0);
        this.add(this._roombasic);


    }

    update(){

        this.camera.update();//lookAtで中心みてる

        this._frame++;
        // if (this._frame > 360) {
        if (this._frame > 720) {//トロッコおそくしてる
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


        //_pointsではなくpointsのままのもの
        // const currentPoint = this._rail.points[this._frame];
        // const nextPoint = this._rail.points[this._frame +1];
        // const normal = this._getNormal(currentPoint,nextPoint);

        // this._car.position.copy(this._rail.points[this._frame]);
        // this._car.up.set(normal.x, normal.y, normal.z);
        // this._car.lookAt(this._rail.points[this._frame + 1]);


        //moveCamera用。vector3がかえってくる
        // this.Ahead =  this._getAhead(currentPoint,nextPoint);
        this.currentPoint = this._rail._points[this._frame];
        this.nextPoint = this._rail._points[this._frame +1];
        this.moveCamera.position.copy(this.currentPoint);
        this.moveCamera.lookAt(this.nextPoint);
        // this.moveCamera.lookAt(new THREE.Vector3(0,0,0));
    }


    _getNormal(curretP, nextP) {
        const NormalVec = curretP
                    .clone()
                    .sub(nextP)
                    .normalize()
                    .cross(new THREE.Vector3(0,0,-1));
        return NormalVec;
    }

    _getAhead(curretP, nextP) {
        const AheadVec = curretP
                    .clone()
                    .sub(nextP)
                    .normalize()
        return AheadVec;
    }

}

