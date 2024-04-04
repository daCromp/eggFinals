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

// music.onEnded = function() {
//     clock.stop()
//     delta = 0
//     passedTime = 0
//     start()
//     music.stop()
//     music.start()
// }

var duration = 0

audioLoader.load(
    './music.mp3',
    function (audioBuffer) {
        music.setBuffer(audioBuffer);
        music.setLoop(true)
        music.offset = 0; 
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

const avg = (array) => {
    return Math.floor(array.reduce((a, b) => a + b, 0) / array.length);
}

const min = (calc, minValue) => {
    return calc < minValue ? minValue : calc;
}

const analyser = new THREE.AudioAnalyser(music, 32);
let zoom = undefined

function analyzeAudio() {
    const test = analyser.getFrequencyData()
    const kickArray = test.slice(0, 10)
    zoom = min(avg(kickArray) / 100, 0.7)

    const vec = new THREE.Vector3(zoom, zoom, zoom)

    cube1.scale.lerp(vec, 0.3)
    cube2.scale.lerp(vec, 0.3)
    cube3.scale.lerp(vec, 0.3)
    cube4.scale.lerp(vec, 0.3)
    cube5.scale.lerp(vec, 0.3)
    cube6.scale.lerp(vec, 0.3)
    cube7.scale.lerp(vec, 0.3)
    cube8.scale.lerp(vec, 0.3)
}

const objLoader = new OBJLoader();

let ente = undefined

let donut = undefined;
const objectGroup = new THREE.Group();

let blinkers = undefined;
const objectGroupBlinkers = new THREE.Group();

let entenArray = [];
let blinkersArray = []

objLoader.load(
    'objs/bob_tri.obj',
    function (object) {

        const mainEnteMaterial = new THREE.MeshLambertMaterial({ color: 0xFB6542 });
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = mainEnteMaterial;
            }
        });
        ente = object
        scene.add(object);
        ente.scale.set(0.07, 0.07, 0.07)
        ente.position.z = 0.5

        const materialBasic1 = new THREE.MeshBasicMaterial({ color: 0xffa500 });
        const materialBasic2 = new THREE.MeshBasicMaterial({ color: 0xffa500 });

        const materialLambert = new THREE.MeshLambertMaterial({ color: 0x000000 });

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
                    child.material = materialBasic2;
                }
            });

            entenArray.push(objectCopy1);
            blinkersArray.push(objectCopy2);


            const angle = (i / 11) * Math.PI * 2;
            const radius = 0.5;

            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            entenArray[i].scale.set(0.05, 0.05, 0.05)
            entenArray[i].position.set(x, y, 0.2)
            objectGroup.add(entenArray[i]);

            blinkersArray[i].scale.set(0.05, 0.05, 0.05)
            blinkersArray[i].position.set(x, y, 0.3)
            objectGroupBlinkers.add(blinkersArray[i]);
        }
        donut = objectGroup
        blinkers = objectGroupBlinkers

        blinkersArray.forEach((blinker) => {
            blinker.visible = false
        })
        scene.add(blinkers)
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
    changeBlinkerColors(0x000000)
    // scene.add(blinkers)
}

let lastBlink = 0;

function getRndmNumber() {
    const rndmNumber = Math.floor(Math.random() * blinkersArray.length);
    if (rndmNumber === lastBlink) {
        return getRndmNumber()
    }
    return rndmNumber
}

let called = 0

function blinking() {
    called++
    let rndmNumber = getRndmNumber()
    lastBlink = rndmNumber;
    blinkersArray[lastBlink].visible = true;
}

function stopBlink() {
    blinkersArray[lastBlink].visible = false;
}

const light = new THREE.AmbientLight({ color: 0xFFFFFF, intensity: 1 });
scene.add(light);

const light2 = new THREE.PointLight({ color: 0xFFFFFF, intensity: 1 })
light2.position.y = 0.5
scene.add(light2);

const light3 = new THREE.PointLight({ color: 0xFFFFFF, intensity: 1 })
light3.position.y = -0.5
scene.add(light3);

const light4 = new THREE.PointLight({ color: 0xFFFFFF, intensity: 1 })
light4.position.x = -0.5
scene.add(light4);

const light5 = new THREE.PointLight({ color: 0xFFFFFF, intensity: 1 })
light5.position.x = 0.5
scene.add(light5);

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

const geometry7 = new THREE.BoxGeometry(0.125, 0.125, 0.125);
const material7 = new THREE.MeshBasicMaterial({ color: mainColor2 });
const cube7 = new THREE.Mesh(geometry7, material7);
cube7.position.z = -1
scene.add(cube7);

const geometry8 = new THREE.BoxGeometry(0.0625, 0.0625, 0.0625);
const material8 = new THREE.MeshBasicMaterial({ color: mainColor3 });
const cube8 = new THREE.Mesh(geometry8, material8);
cube8.position.z = 0
scene.add(cube8);

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

// const geometry10 = new THREE.BoxGeometry(1, 20, 0);
// const material10 = new THREE.MeshBasicMaterial({ color: 0xFFE346 });
// const stripe1 = new THREE.Mesh(geometry10, material10);
// stripe1.position.z = -10
// stripe1.position.x = 8
// stripe1.position.y = -20
// // scene.add(stripe1);

// const geometry11 = new THREE.BoxGeometry(1, 20, 0);
// const stripe2 = new THREE.Mesh(geometry11, material10);
// stripe2.position.z = -10
// stripe2.position.x = -8
// stripe2.position.y = 20
// // scene.add(stripe2);

// const geometry12 = new THREE.BoxGeometry(20, 1, 0);
// const stripe3 = new THREE.Mesh(geometry12, material10);
// stripe3.position.z = -10
// stripe3.position.x = -20
// stripe3.position.y = -3
// // scene.add(stripe3);

// const geometry13 = new THREE.BoxGeometry(20, 1, 0);
// const stripe4 = new THREE.Mesh(geometry13, material10);
// stripe4.position.z = -10
// stripe4.position.x = 20
// stripe4.position.y = 3
// // scene.add(stripe4);

function changeColors(color1, color2, color3) {
    renderer.setClearColor(color1);
    cube1.material.color.set(color2);
    cube2.material.color.set(color3);
    cube3.material.color.set(color1);
    cube4.material.color.set(color2);
    cube5.material.color.set(color3);
    cube6.material.color.set(color1);
    cube7.material.color.set(color2);
    cube8.material.color.set(color3);
}

function changeDuckColors(color) {
    entenArray[0].traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.color.set(color);
        }
    });
}

function changeBlinkerColors(color) {
    blinkersArray[0].traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.color.set(color);
        }
    });
}

function changeDuckColor(color) {
    ente.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.color.set(color);
        }
    });
}

function changeDuckMesh(color) {
    const material = new THREE.MeshLambertMaterial({ color: color })
    ente.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = material
        }
    });
}

function upsizeDucks() {

    for (let i = 0; i < 11; i++) {

        const angle = (i / 11) * Math.PI * 2;
        const radius = 0.5;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        entenArray[i].scale.set(0.02, 0.02, 1.2)
        entenArray[i].position.set(x, y, 0.2)
    }

}

function downsizeDucks() {

    for (let i = 0; i < 11; i++) {

        const angle = (i / 11) * Math.PI * 2;
        const radius = 0.5;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        entenArray[i].scale.set(0.05, 0.05, 0.05)
        entenArray[i].position.set(x, y, 0.2)
    }

}

function jumping() {
    for (let i = 0; i < 11; i++) {

        const angle = (i / 11) * Math.PI * 2;
        const radius = 0.5;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        entenArray[i].position.set(x + x / 6 * zoom, y + y / 6 * zoom)

    }
}

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

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function () {
    music.play();
    music.context.resume()
    clock.start()
    freezedScene = false
    animate();
})


const stopButton = document.getElementById('stopButton');
stopButton.addEventListener('click', function () {
    music.pause();
    music.context.suspend();
    passedTime = delta
    clock.stop()
    freezedScene = true
})

function resetTime() {
    clock.stop()
    delta = 0
    passedTime = 0
    downsizeDucks()
    changeDuckColors(0xffa500)
    scene.remove(donut)
    spinnSpeed = 0
    called = 0
    stopBlink
    clock.start()
}

let spinnSpeed = 0;

music.context.suspend()

var passedTime = 0
var delta = 0
var freezedScene = true

function animate() {

    console.log(duration + "f sdfg sd fs ")

    if(!freezedScene) {
        const currentTime = music.context.currentTime - music.startTime;
        if(clock.running) {
            delta = clock.getElapsedTime() + passedTime
            // console.log(music.context.currentTime + music.offset)
            console.log(delta)
        }

        if(duration <= delta){
            resetTime()
            console.log("hello")
        }
    
        analyzeAudio();
    
        if(delta < 23 && delta > 0) {
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
    
        if (25.15 < delta && delta < 25.25) {
            entenRing(scene)
        }
    
        if (donut) {
            jumping()
            if (39 > delta || delta > 40.5) {
                donut.rotation.z += 0.005;
                cube1.rotation.z += -0.02;
                cube4.rotation.z += 0.02;
                cube6.rotation.z += -0.02;
            }
            objectGroup.children.forEach(function (ente, index) {
                ente.rotation.x += 0.01;
                ente.rotation.y += 0.01;
            });
    
            objectGroupBlinkers.children.forEach(function (blinker, index) {
    
                if (blinker) {
                    blinker.rotation.x += 0.01;
                    blinker.rotation.y += 0.01;
                }
            });
    
        }
    
        if (29.03 < delta && delta < 29.13) {
            changeColors(0x003366, 0xCCFF33, 0x00FF99)
            changeDuckColors(0xCCFF33)
            changeDuckColor(0x003366)
            // scene.remove(ente)
            // scene.add(astro)
        }
    
        if (32.9 < delta && delta < 33) {
            changeColors(0x53004B, 0xFDD023, 0x7549B1)
            changeDuckColors(0x7549B1)
            changeDuckColor(0x53004B)
            // scene.remove(astro)
            // scene.add(face)
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
    
        if (40.6 < delta && delta < 40.7) {
            changeColors(0xFF522D, 0xffa500, 0xFFE346)
            changeDuckColors(0xFF522D)
            upsizeDucks()
            changeDuckMesh(0xFF522D)
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
    
        //dlasdlsdfh
    
        if (56.1 < delta && delta < 56.2) {
            scene.add(donut)
            upsizeDucks()
            changeColors(0xFF522D, 0xffa500, 0xFFE346)
            changeDuckColors(0xFF522D)
            changeDuckMesh(0xFF522D)
            // changeBlinkerColors(0xFFFF00)
        }
    
        if (56.85 < delta && delta < 56.95) {
            if (called === 0) {
                // changeColors(0xFB6542, 0xffa500, 0xFFE346)
                // changeDuckColors(0xFB6542)
                // changeBlinkerColors(0xFFFF00)
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
    
        }
    
        if (57.2 < delta && delta < 57.3) {
            if (called === 1) {
                // changeColors(0x003366, 0xCCFF33, 0x00FF99)
                // changeDuckColors(0x003366)
                // changeDuckColor(0x003366)
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        if (57.5 < delta && delta < 57.6) {
            if (called === 2) {
                // changeColors(0x53004B, 0xFDD023, 0x7549B1)
                // changeDuckColors(0x53004B)
                // changeDuckColor(0x53004B)
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        if (57.8 < delta && delta < 57.9) {
            if (called === 3) {
                // changeColors(0x990033, 0xFFFF00, 0x336699)
                // changeDuckColors(0x990033)
                // changeDuckColor(0x990033)
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        if (57.95 < delta && delta < 58.05) {
            if (called === 4) {
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        // flsidfjlskdjf
    
        if (58.78 < delta && delta < 58.88) {
            if (called === 5) {
                changeBlinkerColors(0xFFFF00)
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99) 
    
        }
    
        if (59.17 < delta && delta < 59.27) {
            if (called === 6) {
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        if (59.55 < delta && delta < 59.65) {
            if (called === 7) {
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        if (59.75 < delta && delta < 59.8) {
            if (called === 8) {
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        if (59.85 < delta && delta < 59.95) {
            if (called === 9) {
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        //jerbgfkjsdbgkjbdsgf
    
        if (60.7 < delta && delta < 60.8) {
            if (called === 10) {
                changeBlinkerColors(0xFFFF00)
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
    
        }
    
        if (61 < delta && delta < 61.1) {
            if (called === 11) {
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        if (61.45 < delta && delta < 61.55) {
            if (called === 12) {
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        if (61.7 < delta && delta < 61.8) {
            if (called === 13) {
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        if (61.8 < delta && delta < 61.9) {
            if (called === 14) {
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        //lkfslkdflskdnf
    
    
        if (62.9 < delta && delta < 62.95) {
            if (called === 15) {
                changeBlinkerColors(0xFFFF00)
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
    
        }
    
        if (63.2 < delta && delta < 63.3) {
            if (called === 16) {
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        if (63.65 < delta && delta < 63.7) {
            if (called === 17) {
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        if (63.85 < delta && delta < 63.9) {
            if (called === 18) {
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        if (63.95 < delta && delta < 64.05) {
            if (called === 19) {
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        //lkfslkdflskdnf
    
    
        if (64.5 < delta && delta < 64.6) {
            if (called === 15) {
                changeBlinkerColors(0xFFFF00)
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
    
        }
    
        if (65 < delta && delta < 65.1) {
            if (called === 16) {
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        if (65.3 < delta && delta < 65.4) {
            if (called === 17) {
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        if (65.5 < delta && delta < 65.6) {
            if (called === 18) {
                stopBlink()
                blinking()
            }
            // changeColors(0xFFFFFF, 0xCCFF33, 0x00FF99)
        }
    
        if (65.7 < delta && delta < 65.8) {
            if (called === 19) {
                stopBlink()
                blinking()
            }
            // changeColors(0x000000, 0xCCFF33, 0x00FF99)
        }
    
        if(delta > 64 && delta < 87) {
            closeScene()
            // music.context.currentTime = 0
        }
        requestAnimationFrame(animate);
    }
    renderer.render(scene, camera);
}

animate();