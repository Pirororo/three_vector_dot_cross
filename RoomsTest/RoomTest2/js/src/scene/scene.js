// import * as THREE from '../../libs/three.module.js';
// import {Camera, RoomCamera, MoveCamera} from '../camera/camera.js';
import {Camera} from '../camera/camera.js';
import Line from '../objects/line.js';

/**
 * シーンクラス：カメラとライト
 */
export class Scene extends THREE.Scene {

    constructor(){

        super();

        // this._frame = 0;//frame

        //カメラ３種
        //mainCamera
        this.camera = new Camera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする
        this.camera.position.x = 215;
        this.camera.position.y = 180;
        this.camera.position.z = 150;

        // this.camera.position.x = -55;
        // this.camera.position.y = 35;
        // this.camera.position.z = 65;
        

        // //roomCamera
        // this.roomCamera = new RoomCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする

        // //moveCamera
        // this.moveCamera = new MoveCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする


        // 環境光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        // this.add(ambientLight);

        // 平行光源
        // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        // this.add(directionalLight);

        //スポットライト
        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.castShadow = true;
        spotLight.position.set(80, 60, 50);
        spotLight.intensity = 1;
        // spotLight.shadow.mapSize.width = 2048;
        // spotLight.shadow.mapSize.height = 2048;
        // spotLight.shadow.camera.fov = 120;
        // spotLight.shadow.camera.near = 1;
        // spotLight.shadow.camera.far = 1000;
        // this.add(spotLight);

        //シーン２種類にわけた⇦マスクするため
        this.scene1 = new Scene1();
        this.add(this.scene1);

        this.scene2 = new Scene2();
        this.scene2.add(ambientLight);
        // this.scene2.add(directionalLight);
        this.scene2.add(spotLight);
        this.add(this.scene2);

        

    }

    update(){
        this.camera.update();//lookAtで中心みてる
        this.scene1.update();
    }

}

export class Scene1 extends THREE.Scene {

    constructor(){

        super();

        //ライン
        this._line = new Line();
        this._line.position.set(0,0,0);
        this.add(this._line);

        //ライン2
        this._line2 = new Line();
        this._line2.rotation.x = 90 * Math.PI/180;
        this._line2.rotation.y = 90 * Math.PI/180;
        this._line2.rotation.z = 90 * Math.PI/180;
        this.add(this._line2);

        //ライン3
        this._line3 = new Line();
        this._line3.rotation.x = 90 * Math.PI/180;
        this._line3.rotation.y = 90 * Math.PI/180;
        this.add(this._line3);

        //ライン4
        this._line4 = new Line();
        this._line4.rotation.z = 90 * Math.PI/180;
        this._line4.rotation.y = 90 * Math.PI/180;
        this.add(this._line4);

        //BOX
        this.body = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshLambertMaterial({
            color: 0xff0000,
        })
        );
        this.body.position.set(0,0,0);
        this.add(this.body);

    }
    
    update(){
        this._line.update();
    }

}

export class Scene2 extends THREE.Scene {

    constructor(){

        super();

        //プレート
        this.meshList = [];
        this.meshGroup = new THREE.Group();

        const xMax = 7;
        const yMax = 7;
        const zMax = 7;
        let k = 0;
        const material = new THREE.MeshLambertMaterial({ 
            
            color: 0xffffff, 
            opacity: 0.2,
            transparent: true,
            // depthTest: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < xMax; i++) {
            for (let j = 0; j < yMax; j++) {
                for (let k = 0; k < zMax; k++) {

                    const floorsize = 10* (Math.random()) +10;
                    const geometry = new THREE.BoxBufferGeometry(floorsize, floorsize, floorsize);

                    //もとのやつ
                    const floorPos = floorsize +15;
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = floorPos *i - ((floorPos*xMax)/2);
                    // mesh.position.y = (floorPos+10) *j - (((floorPos+10)*yMax)/2);
                    mesh.position.y = floorPos *j - ((floorPos*yMax)/2);
                    mesh.position.z = floorPos* k - ((floorPos*zMax)/2);
                    // mesh.rotation.x = Math.PI/180 * 90;
                    this.meshGroup.add(mesh);

                    // 配列に保存
                    this.meshList.push(mesh);
                }
            }
        }

        this.add(this.meshGroup);

    }
    
    update(){
    }

}