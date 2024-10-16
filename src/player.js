import * as THREE from "three"
import { search } from "./pathfinding"

export class Player extends THREE.Mesh {
  constructor(camera, world) {
    super()
    this.raycaster = new THREE.Raycaster()
    this.geometry = new THREE.CapsuleGeometry(0.25, 0.5)
    this.material = new THREE.MeshStandardMaterial({ color: "blue" })
    //PUT IN MIDDLE OF WORLD
    this.position.set(1.5, 0.5, 5.5)

    this.path = []
    this.pathIndex = -1
    this.pathUpdater = null

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
      const playerCoords = new THREE.Vector2(
        Math.floor(this.position.x),
        Math.floor(this.position.z)
      )

      const selectedCoords = new THREE.Vector2(
        Math.floor(intersections[0].point.x),
        Math.floor(intersections[0].point.z)
      )

      // if we click while player is moving, stop the player
      clearInterval(this.pathUpdater)

      // move the player to the intersection point the player has clicked to
      //  this.position.set(selectedCoords.x + 0.5, 0.5, selectedCoords.y + 0.5)

      // find path from players current postion to selected dquare
      this.path = search(playerCoords, selectedCoords, this.world)
      this.world.path.clear()

      if (this.path === null || this.path.length === 0) {
        console.log("No path found")
        return
      }

      this.path.forEach((coords) => {
        const marker = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.1, 0.1),
          new THREE.MeshStandardMaterial({ color: "red" })
        )
        marker.position.set(coords.x + 0.5, 0, coords.y + 0.5)
        this.world.path.add(marker)
      })

      // trigger interval function to update player
      this.pathIndex = 0
      this.pathUpdater = setInterval(this.updatePosition.bind(this), 500)
    }
  }

  updatePosition() {
    if (this.pathIndex === this.path.length) {
      clearInterval(this.pathUpdater)
      return
    }

    const curr = this.path[this.pathIndex++]
    this.position.set(curr.x + 0.5, 0.5, curr.y + 0.5)
  }
}
