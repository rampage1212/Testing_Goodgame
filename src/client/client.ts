import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const scene = new THREE.Scene();

const light = new THREE.PointLight();
light.position.set(-2.5, 7.5, 15);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(3.2, 1, 2.0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 5;
controls.enableDamping = true;
controls.target.set(3.1,  0, -0.3);

let timer = 0;
let arrow_mixer: THREE.AnimationMixer;
let arrow_modelReady = false;

const fbxLoader: FBXLoader = new FBXLoader();

fbxLoader.load(
    'models/Mutant.fbx',
    (object) => {
        object.scale.set(0.005, 0.005, 0.005);
        object.position.set(3,  -0.67, 0);
        arrow_mixer = new THREE.AnimationMixer(object);
        scene.add(object)
        // add an animation from another file
        fbxLoader.load(
            'models/Old Man Idle.fbx',
            (object) => {
                const animationAction = arrow_mixer.clipAction(
                    (object as THREE.Object3D).animations[0]
                );
                animationAction.play();
                arrow_modelReady = true;
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.log(error);
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
)


let monster_mixer: THREE.AnimationMixer;
let monster_modelReady = false;

fbxLoader.load(
    'models/vanguard_t_choonyung.fbx',
    (object) => {
        object.scale.set(0.003, 0.003, 0.003);
        object.position.set(3.2,  -0.55, -0.5);
        monster_mixer = new THREE.AnimationMixer(object);
        scene.add(object);
        //add an animation from another file
        fbxLoader.load(
            'models/Punching.fbx',
            (object) => {
                const animationAction = monster_mixer.clipAction(
                    (object as THREE.Object3D).animations[0]
                );
                animationAction.play();
                monster_modelReady = true;
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.log(error);
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
)


let paladin_mixer: THREE.AnimationMixer;
let paladin_modelReady = false;

fbxLoader.load(
    'models/Paladin WProp J Nordstrom.fbx',
    (object) => {
        object.scale.set(0.003, 0.003, 0.003);
        object.position.set(3.4,  -0.56, -0.8);
        paladin_mixer = new THREE.AnimationMixer(object);
        scene.add(object);
        //add an animation from another file
        fbxLoader.load(
            'models/Idle.fbx',
            (object) => {
                const animationAction = paladin_mixer.clipAction(
                    (object as THREE.Object3D).animations[0]
                );
                animationAction.play();
                paladin_modelReady = true;
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.log(error);
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
)

const gltfLoader = new GLTFLoader();

gltfLoader.load(
    'models/montemor-o-novos_castle.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh;
                m.receiveShadow = true;
                m.castShadow = true;
            }
            if ((child as THREE.Light).isLight) {
                const l = child as THREE.Light;
                l.castShadow = true;
                l.shadow.bias = -0.003;
                l.shadow.mapSize.width = 2048;
                l.shadow.mapSize.height = 2048;
            }
        })
        gltf.scene.rotation.y = Math.PI * 3 / 4;
        scene.add(gltf.scene);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
)


window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (arrow_modelReady && timer == 0 ) arrow_mixer.update(clock.getDelta());
    if (monster_modelReady && timer == 1 ) monster_mixer.update(clock.getDelta());
    if (paladin_modelReady && timer == 2 ) paladin_mixer.update(clock.getDelta());
    timer++;
    timer%=3;
    render();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();