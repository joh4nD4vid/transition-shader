'use strict';

import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as dat from 'dat.gui';


let vertexShader = null;
let fragmentShader = null;
let material = null;
let time = 0.0;

// Fonction utilitaire pour charger un fichier texte (shader)
function loadShader(url) {
  return fetch(url).then(r => r.text());
}

// Fonction utilitaire pour charger une texture
function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(url, resolve, undefined, reject);
  });
}



let speed = {
  value : 1.0
};

// Variables GUI
const gui = new dat.GUI();
gui.add(speed, 'value', 0, 2, 0.1);




let start = false;
let increment = false;




// Shader uniforms 
let uniforms = {
  u_time: { type: 'f', value: time },
  u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio) },
  u_speed: { type: 'f', value: speed },
  texture_a: { type: 'sample2d', value: null },
  texture_b: { type: 'sample2d', value: null },
  depth_a: { type: 'sample2d', value: null },
  depth_b: { type: 'sample2d', value: null },
  u_transition: { type: 'f', value: 0 }
};


// Nouvelle fonction d'initialisation asynchrone
async function startApp() {
  // Charge shaders et textures en parallèle
  const [vertex, fragment, textureA, textureB, depthA, depthB] = await Promise.all([
    loadShader('shaders/vertex_shader.glsl'),
    loadShader('shaders/fragment_shader.glsl'),
    loadTexture('../img/textures/texture_a.jpg'),
    loadTexture('../img/textures/texture_b.jpg'),
    loadTexture('../img/depth_map/depth_a.png'),
    loadTexture('../img/depth_map/depth_b.png')
  ]);

  vertexShader = vertex;
  fragmentShader = fragment;
  uniforms.texture_a.value = textureA;
  uniforms.texture_b.value = textureB;
  uniforms.depth_a.value = depthA;
  uniforms.depth_b.value = depthB;

  // Vérification et logs
  if (!textureA || !(textureA instanceof THREE.Texture)) {
    console.error('Texture A non chargée !');
  } else {
    console.log('Texture A chargée :', textureA);
  }
  if (!textureB || !(textureB instanceof THREE.Texture)) {
    console.error('Texture B non chargée !');
  } else {
    console.log('Texture B chargée :', textureB);
  }

  shadersDone();
}

// Lance l'initialisation
startApp();





// ...chargement asynchrone géré par startApp()...

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



const time_in_seconds = 0.5;
const time_factor = 1 / ( 60 * time_in_seconds );


// Un autre exemple : avec une boucle de rendu
function animate() {

    requestAnimationFrame( animate );
    render();

    if ( increment ) {
        uniforms.u_transition.value += time_factor;
        uniforms.u_transition.value = uniforms.u_transition.value > 1 ? 1 : uniforms.u_transition.value;
    }

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
























document.addEventListener('keydown', e=> {

  if ( e.key === 'm' ) {
      start = !start;
  }

  test_start();

});




function test_start() {

    if ( start && uniforms.u_transition.value === 0 ) {
        increment = true;
    }

    if ( !start ) {
        increment = false;
        uniforms.u_transition.value = 0;
    }

}