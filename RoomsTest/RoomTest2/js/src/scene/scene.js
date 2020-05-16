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
        // this.camera.position.x = 215;
        // this.camera.position.y = 180;
        // this.camera.position.z = 150;

        // this.camera.position.x = -55;
        // this.camera.position.y = 35;
        // this.camera.position.z = 65;



        // //単純な動きならこっちの書き方のほうがみやすいかも
        // //ここから
        // this.camPos = {x: 215, y: 180, z: 150};
        // this.camera.position.set(this.camPos.x,this.camPos.y,this.camPos.z);

        // // var rndPos = (2*Math.random()-1)*100;//-100~100
        // // this.camTarget= {x:rndPos, y:rndPos, z:rndPos};
        // this.camTarget= {x:50, y:20, z:-100};


        // this.tween = new TWEEN.Tween(this.camPos).to(this.camTarget, 1000).easing(TWEEN.Easing.Elastic.InOut).onUpdate(function(){
        // console.log('update');
        // this.camera.position.x = this.camPos.x;
        // this.camera.position.y = this.camPos.y;
        // this.camera.position.z = this.camPos.z;
        // }).delay(1500).start();//tween.start();も省略されてる
        // //ここまで

        

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

        //シェーダーのエフェクトをマスクするためシーン２種類にわけた
        this.scene1 = new Scene1();
        this.add(this.scene1);

        this.scene2 = new Scene2();
        this.scene2.add(ambientLight);
        // this.scene2.add(directionalLight);
        this.scene2.add(spotLight);
        this.add(this.scene2);

        

    }

    update(){
        // TWEEN.update();
        this.camera.update();//lookAtで中心みてる
        this.scene1.update();
        this.scene2.update();
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
        // this._line2.rotation.x = 180 * Math.PI/180;
        // this._line2.rotation.z = 90 * Math.PI/180;
        this.add(this._line2);

        //ライン3
        this._line3 = new Line();
        // this._line3.rotation.x = 90 * Math.PI/180;
        // this._line3.rotation.y = 90 * Math.PI/180;
        this.add(this._line3);

        //ライン4
        this._line4 = new Line();
        // this._line4.rotation.z = 180 * Math.PI/180;
        // this._line4.rotation.y = 90 * Math.PI/180;
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
        this._line2.update();
        this._line3.update();
        this._line4.update();
    }

}

export class Scene2 extends THREE.Scene {

    constructor(){

        super();

        //プレート
        this.meshList = [];//raycast用
        this.meshGroup = new THREE.Group();

        const xMax = 7;
        const yMax = 7;
        const zMax = 7;

        const material = new THREE.MeshLambertMaterial({ 
            color: 0xffffff, 
            opacity: 0.2,
            transparent: true,
            // depthTest: false,
            side: THREE.DoubleSide,
        });

        // const material = new THREE.MeshBasicMaterial( { 
        //     color: 0xffffff, 
        //     wireframe: true,
        //     opacity: 0.8,
        //     transparent: true,
        //    // depthTest: true,
        //     blending: THREE.AdditiveBlending
        // } );

        // const segments = xMax*yMax*zMax;
        let manyLineGeometry = new THREE.BufferGeometry();
        let manyLineMaterial = new THREE.LineBasicMaterial( { 
            // vertexColors: true,
            color: 0x00ffff,//vertexColors: trueだと意味ない
            // linewidth: 10 //どっちにしろ意味ない
        } );

        let positions = [];
        // var colors = [];
        // var r = 800;


        for (let i = 0; i < xMax; i++) {
            for (let j = 0; j < yMax; j++) {
                for (let k = 0; k < zMax; k++) {

                    this.floorsize = 5* (Math.random()) +3;
                    let geometry = new THREE.BoxBufferGeometry(this.floorsize, this.floorsize, this.floorsize);

                    //もとのやつ
                    let floorPos = this.floorsize +20;
                    let mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = floorPos *i - ((floorPos*xMax)/2);
                    mesh.position.y = floorPos *j - ((floorPos*yMax)/2);
                    mesh.position.z = floorPos *k - ((floorPos*zMax)/2);
                    // mesh.rotation.x = Math.PI/180 * 90;
                    this.meshGroup.add(mesh);

                    // 配列に保存
                    this.meshList.push(mesh);


                    // positions
                    positions.push( mesh.position.x, mesh.position.y, mesh.position.z );

                    // // colors
                    // colors.push( ( mesh.position.x / r ) + 0.5 );
                    // colors.push( ( mesh.position.y / r ) + 0.5 );
                    // colors.push( ( mesh.position.z / r ) + 0.5 );

                }
            }
        }

        this.add(this.meshGroup);

        console.log(positions);//30000個の中身全部[]
        console.log(positions.length);//30000


        //setじゃなくてaddAttributeにする！Float32BufferAttributeはthree.moduleにしかないので、BufferAttributeをつかう
        manyLineGeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positions), 3 ) );
        // // manyLineGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        // manyLineGeometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );


        this.manyLine = new THREE.Line( manyLineGeometry, manyLineMaterial );
        this.add(this.manyLine );


    }
    
    update(){
        // for (let i = 0; i < xMax; i++) {
        //     for (let j = 0; j < yMax; j++) {
        //         for (let k = 0; k < zMax; k++) {

        //         }
        //     }
        // }

        // this.floorsize += 0.1;//きかない

        this.meshGroup.rotation.y += 0.01;
        this.meshGroup.rotation.z += 0.01;
        console.log("rotete!");



    }

}