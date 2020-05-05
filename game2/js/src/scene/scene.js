import * as THREE from '../../libs/three.module.js';
import Camera from '../camera/camera.js';
// import Rail from '../objects/rail.js';
import Car from '../objects/car.js';

export default class Scene extends THREE.Scene{
    constructor(){

        super();

        this.frame = 0;//frame

        //camera
        this.camera = new Camera();//thisにすること！！！これがaddのかわり！！
        this.camera.position.y = 10;
        this.camera.position.x = 10;
        this.camera.position.z = 30;


        // 環境光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.add(ambientLight);

        // 平行光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.add(directionalLight);

        this._car = new Car();
        this._car.position.set(0,0,0);
        this.add(this._car);

    }

    update(){
        this.camera.update();
    }
}