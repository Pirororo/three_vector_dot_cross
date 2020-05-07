import * as THREE from '../../../libs/three.module.js';
import {RoomN1,RoomN2} from './eachRoom/roomN1.js';

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
        // const material = new THREE.MeshPhongMaterial({ color: 0x0fffff,opacity:0.5 });

        this.meshList = [];
        const xMax = 5;
        const zMax = 4;
        let k = 0;

        for (let i = 0; i < xMax; i++) {
            for (let j = 0; j < zMax; j++) {

                // const geometry = new THREE.BoxBufferGeometry(floorsize, 1, floorsize);
                const material = new THREE.MeshPhongMaterial({ color: 0x0fffff, opacity:0.5 });


                ////もとのやつ//////////////////////////////////

                // const floorPos = floorsize +5;
                // const mesh = new THREE.Mesh(geometry, material);
                // mesh.position.x = floorPos *i - ((floorPos*xMax)/2);
                // mesh.position.y = 0;
                // mesh.position.z = floorPos* j - ((floorPos*zMax)/2);
                // // mesh.rotation.x = Math.random() * 2 * Math.PI;
                // // this._scene.add(mesh);
                // this.add(mesh);
    
    
                // // 配列に保存
                // this.meshList.push(mesh);


                ////addでだめ//////////////////////////////////

                // this.roomMeshList = [];
                // const roomN1 = new RoomN1();
                // this.roomMeshList[k].add(roomN1.maru);//addだめだって

                // const floorPos = floorsize +5;
                // const mesh = new THREE.Mesh(geometry, material);
                // mesh.position.x = floorPos *i - ((floorPos*(xMax-1))/2);
                // mesh.position.y = 0;
                // mesh.position.z = floorPos* j - ((floorPos*(zMax-1))/2);
                // this.roomMeshList[k].add(mesh);

                // this.add(this.roomMeshList[k]);

                // // 配列に保存
                // this.meshList.push(this.roomMeshList[k]);

                // k++;


                /////////////////////////////////////

                this.roomList = [ new RoomN1(), new RoomN2(),new RoomN1(),new RoomN1(), new RoomN1(),new RoomN1(),new RoomN1(), new RoomN1(),new RoomN1(),new RoomN1(), new RoomN1(),new RoomN1(),new RoomN1(), new RoomN1(),new RoomN1(),new RoomN1(), new RoomN1(),new RoomN1(),new RoomN1(), new RoomN1()];


                // this.roomList[k] = new RoomN1();
                // this.meshList[k]= roomN1.maru;//roomN1.maruはmesh

                this.meshList[k]= this.roomList[k].maru;//roomN1.maruはmesh

                const floorPos = floorsize +5;
                this.mesh = new THREE.Mesh(geometry, material);

                this.meshList[k].add (this.mesh);////////////////////
                this.meshList[k].position.x = floorPos *i - ((floorPos*(xMax-1))/2);
                this.meshList[k].position.y = 0;
                this.meshList[k].position.z = floorPos* j - ((floorPos*(zMax-1))/2);

                this.add(this.meshList[k]);

                k++;//だいじ


                /////////////////////////////////////


                // this.mesh = new THREE.Mesh();
                // this.mesh.add(this.roomList[k].maru);
                // // this.mesh = this.roomList[k].maru;//roomN1.maruはmesh

                // const floorPos = floorsize +5;
                // this.box = new THREE.Mesh(geometry, material);
                // this.mesh.add(this.box);
                // this.mesh.position.x = floorPos *i - ((floorPos*(xMax-1))/2);
                // this.mesh.position.y = 0;
                // this.mesh.position.z = floorPos* j - ((floorPos*(zMax-1))/2);
                // this.add(this.mesh);

                // // 配列に保存
                // this.meshList.push(this.mesh);

                // k++;

                /////////////////////////////////////


                // const mesh = new THREE.Mesh();
                // mesh.add(this.roomList[k].maru);
                // // this.mesh = this.roomList[k].maru;//roomN1.maruはmesh

                // const floorPos = floorsize +5;
                // this.box = new THREE.Mesh(geometry, material);
                // mesh.add(this.box);
                // mesh.position.x = floorPos *i - ((floorPos*(xMax-1))/2);
                // mesh.position.y = 0;
                // mesh.position.z = floorPos* j - ((floorPos*(zMax-1))/2);
                // this.add(mesh);

                // // 配列に保存
                // this.meshList.push(mesh);

                // k++;
                

            }
        }
    }
  
    /**
     * フレーム毎の更新をします。
     */
    update() {}

  }
  