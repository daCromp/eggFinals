import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1.05;

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFB6542);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock(false)

const audioListener = new THREE.AudioListener();
camera.add(audioListener);
const music = new THREE.Audio(audioListener);
scene.add(music);
const audioLoader = new THREE.AudioLoader();

var duration = 0

audioLoader.load(
    './music.mp3',
    function (audioBuffer) {
        music.setBuffer(audioBuffer)
        music.setLoop(true)
        music.offset = 0
        music.setVolume(0.5)
        duration = audioBuffer.duration
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (err) {
        console.log(err)
        console.log('An error happened1');
    }
);

const analyser = new THREE.AudioAnalyser(music, 32);
let zoom = undefined

const avg = (array) => {
    return Math.floor(array.reduce((a, b) => a + b, 0) / array.length);
}

const min = (calc, minValue) => {
    return calc < minValue ? minValue : calc;
}

function analyzeAudio() {
    const data = analyser.getFrequencyData()
    const frequencyArray = data.slice(0, 10)
    zoom = min(avg(frequencyArray) / 100, 0.7)

    const vec = new THREE.Vector3(zoom, zoom, zoom)

    cube1.scale.lerp(vec, 0.3)
    cube2.scale.lerp(vec, 0.3)
    cube3.scale.lerp(vec, 0.3)
    cube4.scale.lerp(vec, 0.3)
    cube5.scale.lerp(vec, 0.3)
    cube6.scale.lerp(vec, 0.3)
    cube7.scale.lerp(vec, 0.3)
}

const objLoader = new OBJLoader();

let ente = undefined

let donut = undefined;
const objectGroup = new THREE.Group();

let donut2 = undefined;
const objectGroup2 = new THREE.Group();

let entenArray = [];
let entenArray2 = [];

const vertPhong = `
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`

const fragPhong = `
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 lightDir = normalize(vec3(0.0, 1.0, 1.0)); 

    vec3 ambient = diffuseColor * 0.3;

    float diffuseIntensity = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diffuseColor * diffuseIntensity;

    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = specularColor * spec * 0.5;

    vec3 result = ambient + diffuse + specular;
    gl_FragColor = vec4(result, 1.0);
}
`

const phongMat = new THREE.ShaderMaterial({
    uniforms: {
        diffuseColor: { value: new THREE.Color(0xFF522D) },
        specularColor: { value: new THREE.Color(0xffffff) },
        shininess: { value: 1 }
    },
    vertexShader: vertPhong,
    fragmentShader: fragPhong
});

const vertLambert = `
varying vec3 vNormal;

void main() {
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragLambert = `
varying vec3 vNormal;
uniform vec3 diffuseColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(vec3(0.0, 1.0, 1.0)); // Richtung des Lichts
    float intensity = dot(normal, lightDirection);
    vec3 color = diffuseColor * intensity;

    gl_FragColor = vec4(color, 1.0);
}
`
const lambertMat = new THREE.ShaderMaterial({
    uniforms: {
        diffuseColor: { value: new THREE.Color(0xffa500) },
    },
    vertexShader: vertLambert,
    fragmentShader: fragLambert
});


objLoader.load(
    'objs/bob_tri.obj',
    function (object) {

        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = phongMat;
            }
        });
        ente = object
        scene.add(object);
        ente.scale.set(0.07, 0.07, 0.07)
        ente.position.z = 0.5

        const materialBasic1 = new THREE.MeshBasicMaterial({ color: 0xffa500 });
        const materialBasic2 = new THREE.MeshBasicMaterial({ color: 0xffa500 });

        for (let i = 0; i < 11; i++) {
            let objectCopy1 = object.clone();
            let objectCopy2 = objectCopy1.clone();
            objectCopy2.name = "test" + i


            objectCopy1.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = materialBasic1;
                }
            });

            objectCopy2.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = lambertMat;
                }
            });

            entenArray.push(objectCopy1);
            entenArray2.push(objectCopy2);


            const angle = (i / 11) * Math.PI * 2;
            const radius = 0.5;

            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            entenArray[i].scale.set(0.05, 0.05, 0.05)
            entenArray[i].position.set(x, y, 0.2)
            objectGroup.add(entenArray[i]);

            entenArray2[i].scale.set(0.05, 0.05, 0.05)
            entenArray2[i].position.set(x, y, 0.2)
            objectGroup2.add(entenArray2[i]);
        }
        donut = objectGroup
        donut2 = objectGroup2
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log(error)
        console.log('An error happened3');
    }
);

function entenRing(scene) {
    scene.add(donut)
}

const light = new THREE.AmbientLight({ color: 0xFFFFFF, intensity: 0.1 });
scene.add(light);

const mainColor1 = 0xFB6542
const mainColor2 = 0xffa500
const mainColor3 = 0xFFE346

const geometry1 = new THREE.BoxGeometry(2.5, 2.5, 2.5);
const material1 = new THREE.MeshBasicMaterial({ color: mainColor2 });
const cube1 = new THREE.Mesh(geometry1, material1);
cube1.position.z = -7
cube1.rotation.z = Math.PI / 4
scene.add(cube1);

const geometry2 = new THREE.BoxGeometry(2, 2, 2);
const material2 = new THREE.MeshBasicMaterial({ color: mainColor3 });
const cube2 = new THREE.Mesh(geometry2, material2);
cube2.position.z = -6
scene.add(cube2);

const geometry3 = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material3 = new THREE.MeshBasicMaterial({ color: mainColor1 });
const cube3 = new THREE.Mesh(geometry3, material3);
cube3.position.z = -5
scene.add(cube3);

const geometry4 = new THREE.BoxGeometry(1, 1, 1);
const material4 = new THREE.MeshBasicMaterial({ color: mainColor2 });
const cube4 = new THREE.Mesh(geometry4, material4);
cube4.position.z = -4
cube4.rotation.z = Math.PI / 4
scene.add(cube4);

const geometry5 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material5 = new THREE.MeshBasicMaterial({ color: mainColor3 });
const cube5 = new THREE.Mesh(geometry5, material5);
cube5.position.z = -3
scene.add(cube5);

const geometry6 = new THREE.BoxGeometry(0.25, 0.25, 0.25);
const material6 = new THREE.MeshBasicMaterial({ color: mainColor1 });
const cube6 = new THREE.Mesh(geometry6, material6);
cube6.position.z = -2
cube6.rotation.z = Math.PI / 4
scene.add(cube6);

const geometry7 = new THREE.BoxGeometry(0.0625, 0.0625, 0.0625);
const material7 = new THREE.MeshBasicMaterial({ color: mainColor3 });
const cube7 = new THREE.Mesh(geometry7, material7);
cube7.position.z = 0
scene.add(cube7);

const openerGeo1 = new THREE.BoxGeometry(0.6, 0.6, 0.0005);
const openerMat1 = new THREE.MeshBasicMaterial({ color: 0x000000 });
const opener1 = new THREE.Mesh(openerGeo1, openerMat1);
opener1.position.z = 0.94
opener1.rotation.z = Math.PI / 4
opener1.position.x = 0.2
opener1.position.y = 0.2
scene.add(opener1);

const openerGeo2 = new THREE.BoxGeometry(0.6, 0.6, 0.0005);
const openerMat2 = new THREE.MeshBasicMaterial({ color: 0x000000 });
const opener2 = new THREE.Mesh(openerGeo2, openerMat2);
opener2.position.z = 0.94
opener2.rotation.z = Math.PI / 4
opener2.position.x = -0.2
opener2.position.y = 0.2
scene.add(opener2);

const openerGeo3 = new THREE.BoxGeometry(0.6, 0.6, 0.0005);
const openerMat3 = new THREE.MeshBasicMaterial({ color: 0x000000 });
const opener3 = new THREE.Mesh(openerGeo3, openerMat3);
opener3.position.z = 0.94
opener3.rotation.z = Math.PI / 4
opener3.position.x = 0.2
opener3.position.y = -0.2
scene.add(opener3);

const openerGeo4 = new THREE.BoxGeometry(0.6, 0.6, 0.0005);
const openerMat4 = new THREE.MeshBasicMaterial({ color: 0x000000 });
const opener4 = new THREE.Mesh(openerGeo4, openerMat4);
opener4.position.z = 0.94
opener4.rotation.z = Math.PI / 4
opener4.position.x = -0.2
opener4.position.y = -0.2
scene.add(opener4);

function openScene() {
    opener1.position.x += 0.00007
    opener1.position.y += 0.00007

    opener2.position.x -= 0.00007
    opener2.position.y += 0.00007

    opener3.position.x += 0.00007
    opener3.position.y -= 0.00007

    opener4.position.x -= 0.00007
    opener4.position.y -= 0.00007
}

function closeScene() {
    opener1.position.x -= 0.00007
    opener1.position.y -= 0.00007

    opener2.position.x += 0.00007
    opener2.position.y -= 0.00007

    opener3.position.x -= 0.00007
    opener3.position.y += 0.00007

    opener4.position.x += 0.00007
    opener4.position.y += 0.00007
}

function changeColors(color1, color2, color3) {
    renderer.setClearColor(color1);
    cube1.material.color.set(color2);
    cube2.material.color.set(color3);
    cube3.material.color.set(color1);
    cube4.material.color.set(color2);
    cube5.material.color.set(color3);
    cube6.material.color.set(color1);
    cube7.material.color.set(color3);
}

function changeDuckColors(color) {
    entenArray[0].traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.color.set(color);        
        }
    });
}

function changeDuckColors2(color) {
    entenArray2[0].traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.uniforms.diffuseColor.value.set(color);
        }
    });
}

function changeDuckColor(color) {
    ente.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.uniforms.diffuseColor.value.set(color);
        }
    });
}

function upsizeDucks() {
    for (let i = 0; i < 11; i++) {
        entenArray[i].scale.set(0.02, 0.02, 1.2)
    }
}

function downsizeDucks() {
    for (let i = 0; i < 11; i++) {
        entenArray[i].scale.set(0.05, 0.05, 0.05)
    }
}

function jumping() {
    for (let i = 0; i < 11; i++) {
        const angle = (i / 11) * Math.PI * 2;
        const radius = 0.5;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        entenArray[i].position.set(x + x / 6 * zoom, y + y / 6 * zoom)
        entenArray2[i].position.set(x + x / 6 * zoom, y + y / 6 * zoom)
    }
}

function resetTime() {
    clock.stop()
    delta = 0
    passedTime = 0
    downsizeDucks()
    changeDuckColors(0xffa500)
    changeDuckColor(0xFB6542)
    changeColors(0xFF522D, 0xffa500, 0xFFE346)
    scene.remove(donut)
    scene.remove(donut2)
    spinnSpeed = 0
    clock.start()
}

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function () {
    if (!clock.running) {
        music.play();
        clock.start()
        freezedScene = false
        animate();
    }
})

const stopButton = document.getElementById('stopButton');
stopButton.addEventListener('click', function () {
    music.pause();
    passedTime = delta
    clock.stop()
    freezedScene = true
})

let spinnSpeed = 0;

var passedTime = 0
var delta = 0
var freezedScene = true

function animate() {

    if (!freezedScene) {
        if (clock.running) {
            delta = clock.getElapsedTime() + passedTime
        }

        if (duration <= delta) {
            resetTime()
        }

        analyzeAudio();

        if (delta < 23 && delta > 0) {
            openScene()
        }


        if (delta < 25.15 && delta > 0) {
            cube1.rotation.z -= spinnSpeed
            cube4.rotation.z += spinnSpeed
            cube6.rotation.z -= spinnSpeed
            spinnSpeed += 0.00002
        }

        if (ente) {
            ente.rotation.x += 0.01;
            ente.rotation.y += 0.01;
        }

        // first drop

        if (25.15 < delta && delta < 25.25) {
            entenRing(scene)
        }

        if (donut) {
            jumping()
            if (38.7 > delta || delta > 40.6) {
                if (delta < 54.5 || delta > 56.1) {
                    if (delta < 69.7 || delta > 71.4) {
                        donut.rotation.z += 0.005;
                        cube1.rotation.z += -0.02;
                        cube4.rotation.z += 0.02;
                        cube6.rotation.z += -0.02;
                    }
                }
            }
            objectGroup.children.forEach(function (ente, index) {
                ente.rotation.x += 0.01;
                ente.rotation.y += 0.01;
            });
        }

        if (donut2) {
            if (delta < 69.7 || delta > 71.4) {
                donut2.rotation.z += 0.005
            }
            objectGroup2.children.forEach(function (donut, index) {

                if (donut) {
                    donut.rotation.x += 0.01;
                    donut.rotation.y += 0.01;
                }
            });
        }

        if (29.03 < delta && delta < 29.13) {
            changeColors(0x003366, 0xCCFF33, 0x00FF99)
            changeDuckColors(0x00FF99)
            changeDuckColor(0x003366)
        }

        if (32.9 < delta && delta < 33) {
            changeColors(0x53004B, 0xFDD023, 0x7549B1)
            changeDuckColors(0x7549B1)
            changeDuckColor(0x53004B)

        }

        if (36.77 < delta && delta < 36.87) {
            changeColors(0x990033, 0xFFFF00, 0x336699)
            changeDuckColors(0xFFFF00)
            changeDuckColor(0x990033)
        }

        if (38.7 < delta && delta < 40.6) {
            donut.rotation.z -= 0.002;
            cube1.rotation.z -= -0.02;
            cube4.rotation.z -= 0.02;
            cube6.rotation.z -= -0.02;
        }

        // second drop

        if (40.6 < delta && delta < 40.7) {
            changeColors(0xFF522D, 0xffa500, 0xFFE346)
            changeDuckColors(0xFF522D)
            changeDuckColor(0xFF522D)
            upsizeDucks()
        }

        if (44.5 < delta && delta < 44.6) {
            changeColors(0x003366, 0xCCFF33, 0x00FF99)
            changeDuckColors(0x003366)
            changeDuckColor(0x003366)
        }

        if (48.35 < delta && delta < 48.45) {
            changeColors(0x53004B, 0xFDD023, 0x7549B1)
            changeDuckColors(0x53004B)
            changeDuckColor(0x53004B)

        }
        if (52.3 < delta && delta < 52.4) {
            changeColors(0x990033, 0xFFFF00, 0x336699)
            changeDuckColors(0x990033)
            changeDuckColor(0x990033)
        }

        if (54.5 < delta && delta < 56.1) {
            donut.rotation.z -= 0.002;
            cube1.rotation.z -= -0.02;
            cube4.rotation.z -= 0.02;
            cube6.rotation.z -= -0.02;
        }

        // thrid drop

        if (56.1 < delta && delta < 56.2) {
            if (donut2) {
                changeDuckColors2(0xFFE346)
                scene.add(donut2)
            }
            changeColors(0xFF522D, 0xffa500, 0xFFE346)
            changeDuckColors(0xFF522D)
            changeDuckColor(0xFB6542)
        }

        if (59.9 < delta && delta < 60) {
            changeDuckColors2(0x00FF99)
            changeColors(0x003366, 0xCCFF33, 0x00FF99)
            changeDuckColors(0x003366)
            changeDuckColor(0x003366)
        }

        if (63.8 < delta && delta < 63.9) {
            changeDuckColors2(0x7549B1)
            changeColors(0x53004B, 0xFDD023, 0x7549B1)
            changeDuckColors(0x53004B)
            changeDuckColor(0x53004B)
        }

        if (67.7 < delta && delta < 67.8) {
            changeDuckColors2(0xFFFF00)
            changeColors(0x990033, 0xFFFF00, 0x336699)
            changeDuckColors(0x990033)
            changeDuckColor(0x990033)
        }


        if (69.7 < delta && delta < 71.4) {
            donut2.rotation.z -= 0.002;
            cube1.rotation.z -= -0.02;
            cube4.rotation.z -= 0.02;
            cube6.rotation.z -= -0.02;
        }

        if (71.5 < delta && delta < 71.6) {
            changeDuckColors2(0xFFE346)
            changeColors(0xFF522D, 0xffa500, 0xFFE346)
            changeDuckColors(0xFF522D)
            changeDuckColor(0xFB6542)
        }

        if (75.4 < delta && delta < 75.5) {
            changeDuckColors2(0x00FF99)
            changeColors(0x003366, 0xCCFF33, 0x00FF99)
            changeDuckColors(0x003366)
            changeDuckColor(0x003366)
        }


        if (79.3 < delta && delta < 79.4) {
            changeDuckColors2(0x7549B1)
            changeColors(0x53004B, 0xFDD023, 0x7549B1)
            changeDuckColors(0x53004B)
            changeDuckColor(0x53004B)
        }

        if (83.2 < delta && delta < 83.3) {
            changeDuckColors2(0xFFFF00)
            changeColors(0x990033, 0xFFFF00, 0x336699)
            changeDuckColors(0x990033)
            changeDuckColor(0x990033)
        }


        if (delta > 64 && delta < 87) {
            closeScene()
        }
        requestAnimationFrame(animate);
    }
    renderer.render(scene, camera);
}

animate();