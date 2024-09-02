import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"

//GUI
const gui = new GUI()

//STATS
const stats = new Stats()
document.body.appendChild(stats.dom)

//RENDERER
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setAnimationLoop(animate)
document.body.appendChild(renderer.domElement)

//SCENE
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const controls = new OrbitControls(camera, renderer.domElement)

//LIGHTS
const sun = new THREE.DirectionalLight()
sun.position.set(1, 2, 3)
scene.add(sun)

const ambient = new THREE.AmbientLight()
ambient.intensity = 2.5
scene.add(ambient)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

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

const folder = gui.addFolder("Cube")
folder.add(cube.position, "x", -2, 2, 0.01)
folder.add(cube.position, "y", -2, 2, 0.01)
folder.addColor(cube.material, "color")
