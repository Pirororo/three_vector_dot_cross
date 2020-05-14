'use strict'

var container = document.getElementById( 'container' );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, .1, 1000 );
camera.position.z = -50;
camera.lookAt( scene.position );

var renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true });
renderer.setClearColor(new THREE.Color(0x000000));
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

// var geo = [];//中で定義でok
var meshes = {};//これはここじゃないとだめ

// var material;//中で定義でok


function init() {

	
	if( !meshes[ 0 ] ) { meshes[ 0 ] = prepareMesh(); }

	render();

}

function prepareMesh() {

	var geo = new Float32Array( 200 * 3 );//点は200個
	for( var j = 0; j < geo.length; j += 3 ) {
		geo[ j ] = geo[ j + 1 ] = geo[ j + 2 ] = 0;//最初の点の位置。全部いれてる
	}

	var g = new MeshLine();
	g.setGeometry( geo, function( p ) { return p; } );//function( p ) { return p; }はgeometryのwidthに関与、materialでlinewidth決めてるから気にしなくていい。

	var material = new MeshLineMaterial( {

		// color: new THREE.Color( new THREE.Color( colors[ ~~Maf.randomInRange( 0, colors.length ) ] ) ),
		color: 0x70c1b3,
		opacity: 1,
		lineWidth: 0.3,
		// depthTest: false,
		blending: THREE.NormalBlending,
		transparent: true,
	});

	
	var mesh = new THREE.Mesh( g.geometry, material );//.geometry = new THREE.BufferGeometry()
	mesh.geo = geo;
	mesh.g = g;

	scene.add( mesh );
	return mesh;
}


// function checkIntersection( id ){
function checkIntersection(){

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
		console.log(lineLength);

		if((geo[ geo.length - 6 ]>50||geo[ geo.length - 5 ]>50||geo[ geo.length - 4 ]>50) && lineLength>0){lineLength *= -1;}
		if((geo[ geo.length - 6 ]<-50||geo[ geo.length - 5 ]<-50||geo[ geo.length - 4 ]<0) && lineLength<0){lineLength *= -1;;}


		if(Randomselect >0.66){	

			if(geo[ geo.length - 6 ]>30 && lineLength>0){lineLength *= -1;}
			if(geo[ geo.length - 6 ]<-30&& lineLength<0){lineLength *= -1;}
			geo[ geo.length - 3 ] = geo[ geo.length - 6 ] +lineLength;
			geo[ geo.length - 2 ] = geo[ geo.length - 5 ];
			geo[ geo.length - 1 ] = geo[ geo.length - 4 ];

		}else if(Randomselect >0.33){

			if(geo[ geo.length - 5 ]>30 && lineLength>0){lineLength *= -1;}
			if(geo[ geo.length - 5 ]<-30&& lineLength<0){lineLength *= -1;}
			geo[ geo.length - 3 ] = geo[ geo.length - 6 ];
			geo[ geo.length - 2 ] = geo[ geo.length - 5 ] +lineLength;
			geo[ geo.length - 1 ] = geo[ geo.length - 4 ];

		}else{

			if(geo[ geo.length - 4 ]>0 && lineLength>0){lineLength *= -1;}
			if(geo[ geo.length - 4 ]<-200&& lineLength<0){lineLength *= -1;}
			geo[ geo.length - 3 ] = geo[ geo.length - 6 ];
			geo[ geo.length - 2 ] = geo[ geo.length - 5 ];
			geo[ geo.length - 1 ] = geo[ geo.length - 4 ] +lineLength;
		}

		g.setGeometry( geo );
}


function check() {
	
	for( var i in meshes ) { checkIntersection( i ); }
	setTimeout( check, 80 );//ここの時間ごとに次の点が打たれて更新される
}
check();

function render() {

	// for( var i in meshes ) { checkIntersection(); }
	requestAnimationFrame( render );
	renderer.render( scene, camera );

}

