import * as THREE from "three"
import { search } from "./pathfinding"

export class Player extends THREE.Mesh {
  constructor(camera, world) {
    super()
    this.raycaster = new THREE.Raycaster()
    this.geometry = new THREE.CapsuleGeometry(0.25, 0.5)
    this.material = new THREE.MeshStandardMaterial({ color: "blue" })
    //PUT IN MIDDLE OF WORLD
    this.position.set(5, 0.5, 5)

    this.camera = camera
    this.world = world

    window.addEventListener("mousedown", this.onMouseDown.bind(this))
  }

  onMouseDown(event) {
    // normalize the mouse position to -1 to 1 so raycaster can use
    const coords = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )

    // update the ray with the camera and mouse position
    this.raycaster.setFromCamera(coords, this.camera)

    // calculate objects intersecting the picking ray
    const intersections = this.raycaster.intersectObject(this.world.terrain)

    if (intersections.length > 0) {
      const selectedCoords = new THREE.Vector2(
        Math.floor(intersections[0].point.x),
        Math.floor(intersections[0].point.z)
      )

      // move the player to the intersection point the player has clicked to
      this.position.set(selectedCoords.x + 0.5, 0.5, selectedCoords.y + 0.5)

      search(selectedCoords, null, this.world)
      console.log(selectedCoords)
    }
  }
}
