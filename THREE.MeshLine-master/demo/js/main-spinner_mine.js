'use strict'

var container = document.getElementById( 'container' );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, .1, 1000 );
camera.position.z = -50;
camera.lookAt( scene.position );

var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );

var directions = document.getElementById( 'directions' );

var colors = [
	0xed6a5a,
	0x70c1b3
];


window.addEventListener('load', init);//これいれた

var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

var geo = [];

// var meshes = {}, plane;//このplaneは？
var meshes = {};//けしてみた

var material;


function prepareMesh() {

	var geo = new Float32Array( 100 * 3 );//点は200個
	for( var j = 0; j < geo.length; j += 3 ) {
		geo[ j ] = geo[ j + 1 ] = geo[ j + 2 ] = 0;//最初の点の位置。全部いれてる
	}

	var g = new MeshLine();
	g.setGeometry( geo, function( p ) { return p; } );//function( p ) { return p; }はgeometryのwidthに関与、materialでlinewidth決めてるから気にしなくていい。

	material = new MeshLineMaterial( {

		color: new THREE.Color( new THREE.Color( colors[ ~~Maf.randomInRange( 0, colors.length ) ] ) ),
		opacity: 1,
		lineWidth: 0.3,
		// depthTest: false,
		blending: THREE.NormalBlending,
		transparent: true,
	});

	
	var mesh = new THREE.Mesh( g.geometry, material );//.geometry = new THREE.BufferGeometry()
	//あとでみてわかりやすいようにこうしただけ
	mesh.geo = geo;
	mesh.g = g;


	scene.add( mesh );
	return mesh;

}

function init() {

	window.addEventListener( 'mousedown', onMouseDown );
	window.addEventListener( 'mouseup', onMouseEnd );
	window.addEventListener( 'mouseout', onMouseEnd );
	render();

}


function onMouseDown( e ) {

	directions.style.opacity = 0;//スタート文字のcssを書き換えてる

	if( !meshes[ 0 ] ) {
		meshes[ 0 ] = prepareMesh();
	}
	
}

function onMouseEnd( e ) {

	var id = 0;
	var m = meshes[ id ];
	scene.remove( m );
	delete meshes[ id ];

}

// function checkIntersection( id ){
function checkIntersection(){

		// console.log(id);//0
		// var mesh = meshes[ id ];
		var mesh = meshes[ 0 ];
		var geo = mesh.geo;
		var g = mesh.g;


		//これがないと生えていかない。
		//点の座標を配列の一個まえの点の座標にずらす、geo[ geo.length + 3 ]+4,+5 が空く
		for( var j = 0; j < geo.length; j+= 3 ) {
			geo[ j ] = geo[ j + 3 ] * 1.0;
			geo[ j + 1 ] = geo[ j + 4 ] * 1.0;
			geo[ j + 2 ] = geo[ j + 5 ] * 1.0;

		}

		let Randomselect = Math.random();
		let lineLength = 80 * (Math.random()-0.5) ;

		if(Randomselect >0.66){	
			geo[ geo.length - 3 ] = geo[ geo.length - 6 ] +lineLength;
			geo[ geo.length - 2 ] = geo[ geo.length - 5 ];
			geo[ geo.length - 1 ] = geo[ geo.length - 4 ];
		}else if(Randomselect >0.33){
			geo[ geo.length - 3 ] = geo[ geo.length - 6 ];
			geo[ geo.length - 2 ] = geo[ geo.length - 5 ] +lineLength;
			geo[ geo.length - 1 ] = geo[ geo.length - 4 ];
		}else{
			geo[ geo.length - 3 ] = geo[ geo.length - 6 ];
			geo[ geo.length - 2 ] = geo[ geo.length - 5 ];
			geo[ geo.length - 1 ] = geo[ geo.length - 4 ] +lineLength;
		}

		g.setGeometry( geo );
}


// function check() {
// 	for( var i in meshes ) { checkIntersection( i ); }
// 	setTimeout( check, 20 );//ここの時間ごとに次の点が打たれて更新される
// }
// check();//位置ここなのかな？→renderの中にいれると毎フレーム読み込まれてしまう、20ミリ秒ごとにしたいからここに書いてる


function render() {

	requestAnimationFrame( render );

	for( var i in meshes ) { 
		// checkIntersection( i ); 
		checkIntersection(); 

		// console.log(i);//0
		// console.log(meshes[i]);//na {uuid: "8B599FB1-350C-46E2-A7B0-8C20C389E423", name: "", type: "Mesh", parent: xd, children: Array(0), …}

	}
	// checkIntersection(); 


	

	renderer.render( scene, camera );

}










// 'use strict'

// var container = document.getElementById( 'container' );

// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, .1, 1000 );
// camera.position.z = -50;
// camera.lookAt( scene.position );

// var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setPixelRatio( window.devicePixelRatio );
// container.appendChild( renderer.domElement );

// var directions = document.getElementById( 'directions' );

// var colors = [
// 	0xed6a5a,
// 	0x70c1b3
// ];

// var loader = new THREE.TextureLoader();
// var strokeTexture;
// loader.load( 'assets/stroke.png', function( texture ) {
// 	strokeTexture = texture;
// 	strokeTexture.wrapS = strokeTexture.wrapT = THREE.RepeatWrapping;
// 	init(); } );
// var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

// var geo = [];

// // var raycaster = new THREE.Raycaster();
// // var mouse = {};
// // var nMouse = {};
// // var tmpVector = new THREE.Vector2();
// // var angle = 0;
// var meshes = {}, plane;
// var material;
// var center = new THREE.Vector2( .5, .5 );

// function prepareMesh() {

// 	var geo = new Float32Array( 200 * 3 );
// 	for( var j = 0; j < geo.length; j += 3 ) {
// 		geo[ j ] = geo[ j + 1 ] = geo[ j + 2 ] = 0;
// 	}

// 	var g = new MeshLine();
// 	g.setGeometry( geo, function( p ) { return p; } );

// 	material = new MeshLineMaterial( {
// 		useMap: true,
// 		map: strokeTexture,
// 		color: new THREE.Color( new THREE.Color( colors[ ~~Maf.randomInRange( 0, colors.length ) ] ) ),
// 		opacity: 1,
// 		resolution: resolution,
// 		sizeAttenuation: true,
// 		lineWidth: 5,
// 		near: camera.near,
// 		far: camera.far,
// 		depthTest: false,
// 		blending: THREE.NormalBlending,
// 		transparent: true,
// 		repeat: new THREE.Vector2( 1,2 )
// 	});

// 	var mesh = new THREE.Mesh( g.geometry, material );
// 	mesh.geo = geo;
// 	mesh.g = g;

// 	scene.add( mesh );

// 	return mesh;

// }

// function init() {

// 	plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1000, 1000 ), new THREE.MeshNormalMaterial( { side: THREE.DoubleSide,  } ) );
// 	plane.material.visible = false;
// 	scene.add( plane );

// 	window.addEventListener( 'mousedown', onMouseDown );
// 	window.addEventListener( 'mouseup', onMouseEnd );

// 	window.addEventListener( 'touchstart', onTouchStart );
// 	window.addEventListener( 'touchend', onTouchEnd );
	
// 	window.addEventListener( 'mouseout', onMouseEnd );
// 	window.addEventListener( 'touchcancel', onTouchEnd );

// 	render();

// }

// var userInteracting = false;

// function onMouseDown( e ) {

// 	directions.style.opacity = 0;

// 	if( !meshes[ 0 ] ) {
// 		meshes[ 0 ] = prepareMesh();
// 	}

// 	userInteracting = true;

// 	e.preventDefault();

// }

// function onMouseEnd( e ) {

// 	userInteracting = false;

// 	var id = 0;
// 	var m = meshes[ id ];
// 	scene.remove( m );
// 	delete meshes[ id ];

// 	e.preventDefault();

// }

// function onTouchStart( e ) {

// 	directions.style.opacity = 0;

// 	for( var j = 0; j < e.touches.length; j++ ) {
// 		if( !meshes[ e.touches[ j ].identifier ] ) {
// 			meshes[ e.touches[ j ].identifier ] = prepareMesh();
// 		}
// 	}
// 	e.preventDefault();

// }

// function onTouchEnd( e ) {

// 	userInteracting = false;

// 	for( var j = 0; j < e.changedTouches.length; j++ ) {
// 		var id = e.changedTouches[ j ].identifier;
// 		var m = meshes[ id ];
// 		scene.remove( m );
// 		delete meshes[ id ];
// 	}

// 	e.preventDefault();

// }



// function checkIntersection( id ) {


// 	// See if the ray from the camera into the world hits one of our meshes
// 	// var intersects = raycaster.intersectObject( plane );

// 	// Toggle rotation bool for meshes that we clicked
// 	// if ( intersects.length > 0 ) {

// 		var mesh = meshes[ id ];
// 		var geo = mesh.geo;
// 		var g = mesh.g;

// 		// var d = intersects[ 0 ].point.x;

// 		for( var j = 0; j < geo.length; j+= 3 ) {
// 			geo[ j ] = geo[ j + 3 ] * 1.001;
// 			geo[ j + 1 ] = geo[ j + 4 ] * 1.001;
// 			geo[ j + 2 ] = geo[ j + 5 ] * 1.001;
// 		}

// 		// geo[ geo.length - 3 ] = d * Math.cos( angle );
// 		// geo[ geo.length - 2 ] = intersects[ 0 ].point.y;
// 		// geo[ geo.length - 1 ] = d * Math.sin( angle );

// 		geo[ geo.length - 3 ] +=10 * (Math.random()-0.5);
// 		geo[ geo.length - 2 ] +=10 * (Math.random()-0.5);
// 		geo[ geo.length - 1 ] +=10 * (Math.random()-0.5);

// 		g.setGeometry( geo );
// 	// }
// }


// // var tmpVector = new THREE.Vector3();

// function check() {

// 	// for( var i in nMouse ) { checkIntersection( i ); }
// 	for( var i in meshes ) { checkIntersection( i ); }
// 	setTimeout( check, 20 );

// }
// check();

// function render() {

// 	requestAnimationFrame( render );

// 	// angle += .05;

// 	// for( var i in meshes ) {
//     //   var mesh = meshes[ i ];
//     //   mesh.rotation.y = angle;
//     // }

// 	for( var i in meshes ) {
// 		var geo = meshes[ i ].geo;
// 		for( var j = 0; j < geo.length; j+= 3 ) {
// 			geo[ j ] *= 1.0;
// 			geo[ j + 1 ] *= 1.0;
// 			geo[ j + 2 ] *= 1.0;
// 		}
// 		meshes[ i ].g.setGeometry( geo );
// 	}

// 	renderer.render( scene, camera );

// }
