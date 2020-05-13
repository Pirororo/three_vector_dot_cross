// import * as THREE from '../../libs/three.module.js';
// import {Camera, RoomCamera, MoveCamera} from '../camera/camera.js';
import {Camera} from '../camera/camera.js';
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

        // //roomCamera
        // this.roomCamera = new RoomCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする

        // //moveCamera
        // this.moveCamera = new MoveCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする



        // 環境光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.add(ambientLight);

        // 平行光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
        this.add(directionalLight);

        // //スポットライト
        // // add spotlight for the shadows
        // var spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.castShadow = true;
        // spotLight.position.set(0, 60, 50);
        // spotLight.intensity = 1;
        // spotLight.shadow.mapSize.width = 2048;
        // spotLight.shadow.mapSize.height = 2048;
        // spotLight.shadow.camera.fov = 120;
        // spotLight.shadow.camera.near = 1;
        // spotLight.shadow.camera.far = 1000;
        // this.add(spotLight);

        //ライン
        this._line = new Line();
        this._line.position.set(0,0,0);
        this.add(this._line);

        //プレート
        this.meshList = [];
        const xMax = 10;
        const yMax = 10;
        const zMax = 10;
        let k = 0;
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xffffff, 
            opacity: 0.6,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < xMax; i++) {
            for (let j = 0; j < yMax; j++) {
                for (let k = 0; k < zMax; k++) {

                    const floorsize = 5* (Math.random()) +5;
                    const geometry = new THREE.PlaneBufferGeometry(floorsize, floorsize);

                    //もとのやつ
                    const floorPos = floorsize +3;
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = floorPos *i - ((floorPos*xMax)/2);
                    mesh.position.y = (floorPos+3) *j - (((floorPos+3)*yMax)/2);
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