import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"

//JS MODULES
import { World } from "./world"
import { Player } from "./player"

//GUI
const gui = new GUI()

//STATS
const stats = new Stats()
document.body.appendChild(stats.dom)

//RENDERER
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setAnimationLoop(animate)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

//SCENE
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

//Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(5, 0, 5)
camera.position.set(0, 2, 0)
controls.update()

// TERRAIN
const world = new World(10, 10)
scene.add(world)

//player
const player = new Player(camera, world)
scene.add(player)

//LIGHTS
const sun = new THREE.DirectionalLight()
sun.intensity = 3
sun.position.set(1, 2, 3)
scene.add(sun)

const ambient = new THREE.AmbientLight()
ambient.intensity = 0.5
scene.add(ambient)

function animate() {
  controls.update()
  stats.update()
  renderer.render(scene, camera)
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const worldFolder = gui.addFolder("World")
worldFolder.add(world, "width", 1, 20, 1).name("Width")
worldFolder.add(world, "height", 1, 20, 1).name("Height")
worldFolder.addColor(world.terrain.material, "color").name("Color")
worldFolder.add(world.count, "trees", 1, 100, 1).name("Tree Count")
worldFolder.add(world.count, "rocks", 1, 100, 1).name("Rock Count")
worldFolder.add(world.count, "bushes", 1, 100, 1).name("Bush Count")

worldFolder.add(world, "generate").name("Generate")
