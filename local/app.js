'use strict';

import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as dat from 'dat.gui';


let vertexShader = null;
let fragmentShader = null;
let material = null;
let time = 0.0;

let speed = {
  value : 1.0
};

// Variables GUI
const gui = new dat.GUI();
gui.add(speed, 'value', 0, 2, 0.1);


// Shader uniforms 
let uniforms = {

  u_time : {
      type : 'f',
      value : time
  },

  u_resolution : {
    type : "v2",
    value : new THREE.Vector2(window.innerWidth, window.innerHeight)
        .multiplyScalar(window.devicePixelRatio)
  },

  u_speed : {
    type : "f",
    value : speed
  }

};



// Chargement dynamique des shaders
let request_vertex = new XMLHttpRequest();
let request_fragment = new XMLHttpRequest();

// On les récupère sous forme de texte, à la bonne adresse
request_vertex.open('GET', 'shaders/vertex_shader.glsl', true);
request_vertex.responseType = 'text';

request_fragment.open('GET', 'shaders/fragment_shader.glsl', true);
request_fragment.responseType = 'text';


// Chaque chargement effectué appelle la fonction correspondante
request_vertex.onload = () => {

    if ( request_vertex.readyState === request_vertex.DONE && request_vertex.status === 200 ){
        vertexDone( request_vertex.responseText );
    }
}

request_fragment.onload = () => {
    if ( request_fragment.readyState === request_fragment.DONE && request_fragment.status === 200 ){
        fragmentDone( request_fragment.responseText );
    }
}

request_vertex.send(null);
request_fragment.send(null);


// Ces fonctions vérifient si l'autre shader est chargé.
// Si c'est le cas, on appelle shadersDone()
function vertexDone( text ) {
    vertexShader = text;
    if (fragmentShader !== null) {
        shadersDone();
    }
}

function fragmentDone( text ) {
    fragmentShader = text;
    if (vertexShader !== null) {
        shadersDone();
    }
}

// On peut créer notre matériau et ursuivre.
function shadersDone() {

    // Create the shader material
    material = new THREE.ShaderMaterial({
      uniforms : uniforms,
      vertexShader : vertexShader,
      fragmentShader : fragmentShader
    });

    // Create the mesh and add it to the scene
    var geometry = new THREE.PlaneGeometry(2, 2);
    var shaderPlane = new THREE.Mesh(geometry, material);
    

    // start scene
    init( shaderPlane );
    animate();

}






var camera, scene, renderer, light, monCube, stats;
var controls;


function init( shaderPlane ) {


    // Scene
    const canvas = document.querySelector('#canvas');

    renderer = new THREE.WebGLRenderer({ 
      canvas : canvas, 
      antialias : true
    });

    scene = new THREE.Scene();

    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener('resize', onWindowResize, false);



    // Camera.
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Plane
    scene.add( shaderPlane );
    
    //Stats
    stats = new Stats();
    document.body.appendChild(stats.dom);


}


// Un autre exemple : avec une boucle de rendu
function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  time++;

  stats.update();
  renderer.render( scene, camera );
}



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

