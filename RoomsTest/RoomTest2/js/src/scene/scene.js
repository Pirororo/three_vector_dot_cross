
// import * as THREE from '../../libs/three.module.js';
import {Camera, RoomCamera, MoveCamera} from '../camera/camera.js';
import Rail from '../objects/rail.js';
import Car from '../objects/car.js';
import RoomBasic from '../objects/room/roomBasic.js';
import Line from '../objects/line.js';

/**
 * ステップ２シーンクラスです。
 */
export default class Scene extends THREE.Scene {

    constructor(){

        super();

        // this._frame = 0;//frame



        //カメラ３種
        //mainCamera
        this.camera = new Camera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする
        this.camera.position.x = 150;
        this.camera.position.y = 150;
        this.camera.position.z = 150;

        //roomCamera
        this.roomCamera = new RoomCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする

        //moveCamera
        this.moveCamera = new MoveCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする



        // 環境光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.add(ambientLight);

        // 平行光源
        const directionalLight = new THREE.DirectionalLight(0xff00ff, 0.5);
        this.add(directionalLight);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(20, 20, 20);
        this.add(spotLight);



        // //車
        // this._car = new Car();
        // this._car.position.set(0,0,0);
        // this._car.scale.multiplyScalar(1.5);
        // this._car.position.copy(this._rail._points[0]);
        // this.add(this._car);

        // const material = new THREE.MeshPhongMaterial({ color: 0x0fffff,opacity:0.5 });

        // //ライン
        // this._line = new Line();
        // this._line.position.set(0,0,0);
        // this.add(this._line);


        //プレート
        this.meshList = [];
        const xMax = 7;
        const yMax = 7;
        const zMax = 7;
        let k = 0;

        for (let i = 0; i < xMax; i++) {
            for (let j = 0; j < yMax; j++) {
                for (let k = 0; k < zMax; k++) {


                const floorsize = 20* (Math.random(1.0, 1.0));
                const geometry = new THREE.PlaneBufferGeometry(floorsize, floorsize);
                const material = new THREE.MeshPhongMaterial({ 
                    color: 0xffffff, 
                    opacity: 0.6,
                    transparent: true,
                    // side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending
                
                 });


                ////もとのやつ//////////////////////////////////

                const floorPos = floorsize +5;
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = floorPos *i - ((floorPos*xMax)/2);
                mesh.position.y = (floorPos+5) *j - (((floorPos+5)*yMax)/2);
                mesh.position.z = floorPos* k - ((floorPos*zMax)/2);
                mesh.rotation.x = Math.PI/180 * 90;
                this.add(mesh);

                // 配列に保存
                this.meshList.push(mesh);
                }
            }
        }
    }


    update(){

        this.camera.update();//lookAtで中心みてる
    }

}