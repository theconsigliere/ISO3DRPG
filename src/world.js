import * as THREE from "three"

const textureLoader = new THREE.TextureLoader()
const gridTexture = textureLoader.load("textures/grid.png")

export class World extends THREE.Group {
  // great a data structure to store position of trees, rocks, bushes
  #objectMap = new Map()

  constructor(width, height) {
    super()
    this.width = width
    this.height = height

    this.count = {
      trees: 10,
      rocks: 20,
      bushes: 10,
    }

    this.rocks = new THREE.Group()
    this.add(this.rocks)

    this.trees = new THREE.Group()
    this.add(this.trees)

    this.bushes = new THREE.Group()
    this.add(this.bushes)

    this.generate()
  }

  generate() {
    this.clear()
    this.createTerrain()
    this.createTrees()
    this.createRocks()
    this.createBushes()
  }

  clear() {
    if (this.terrain) {
      this.terrain.geometry.dispose()
      this.terrain.material.dispose()
      this.remove(this.terrain)
    }

    if (this.trees) {
      this.trees.children.forEach((tree) => {
        tree.geometry.dispose()
        tree.material.dispose()
      })
      this.trees.clear()
    }

    if (this.rocks) {
      this.rocks.children.forEach((rock) => {
        rock.geometry.dispose()
        rock.material.dispose()
      })
      this.rocks.clear()
    }

    if (this.bushes) {
      this.bushes.children.forEach((bush) => {
        bush.geometry.dispose()
        bush.material.dispose()
      })
      this.bushes.clear()
    }

    this.#objectMap.clear()
  }

  createTerrain() {
    // tile the texture
    gridTexture.repeat = new THREE.Vector2(this.width, this.height)
    gridTexture.wrapS = THREE.RepeatWrapping
    gridTexture.wrapT = THREE.RepeatWrapping
    gridTexture.colorSpace = THREE.SRGBColorSpace

    const terrainMaterial = new THREE.MeshStandardMaterial({
      map: gridTexture,
      //   wireframe: true,
    })

    const terrainGeometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      this.width,
      this.height
    )
    this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
    this.terrain.name = "Terrain"
    this.terrain.rotation.x = -Math.PI / 2
    this.terrain.position.set(this.width / 2, 0, this.height / 2)
    this.add(this.terrain)
  }

  createTrees() {
    const tree = {
      radius: 0.2,
      height: 1,
    }

    const treeGeometry = new THREE.ConeGeometry(tree.radius, tree.height, 8)
    const treeMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      flatShading: true,
    })

    for (let i = 0; i < this.count.trees; i++) {
      const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial)

      const coords = new THREE.Vector2(
        Math.floor(this.width * Math.random()),
        Math.floor(this.height * Math.random())
      )

      //dont place objects on top of each other
      if (this.#objectMap.get(`${coords.x}-${coords.y}`)) continue

      // to center trees within grid space first floor the number to a whole number then + 0.5 (half a space)
      treeMesh.position.set(coords.x + 0.5, tree.height / 2, coords.y + 0.5)

      this.trees.add(treeMesh)

      // store tree position in object map
      this.#objectMap.set(`${coords.x}-${coords.y}`, treeMesh)
    }
  }

  createRocks() {
    const rock = {
      minRadius: 0.1,
      maxRadius: 0.3,
      minHeight: 0.5,
      maxHeight: 0.8,
    }

    const rockMaterial = new THREE.MeshStandardMaterial({
      color: 0xb0b0b0,
      flatShading: true,
    })

    for (let i = 0; i < this.count.rocks; i++) {
      const rockRadius =
        rock.minRadius + Math.random() * (rock.maxRadius - rock.minRadius)
      const rockHeight =
        rock.minHeight + Math.random() * (rock.maxHeight - rock.minHeight)
      const rockGeometry = new THREE.SphereGeometry(rockRadius, 6, 6)
      const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial)

      const coords = new THREE.Vector2(
        Math.floor(this.width * Math.random()),
        Math.floor(this.height * Math.random())
      )

      //dont place objects on top of each other
      if (this.#objectMap.get(`${coords.x}-${coords.y}`)) continue

      // to center trees within grid space first floor the number to a whole number then + 0.5 (half a space)
      rockMesh.position.set(coords.x + 0.5, 0, coords.y + 0.5)
      rockMesh.scale.y = rockHeight

      this.rocks.add(rockMesh)

      // store rock position in object map
      this.#objectMap.set(`${coords.x}-${coords.y}`, rockMesh)
    }
  }

  createBushes() {
    const bush = {
      minRadius: 0.1,
      maxRadius: 0.3,
      minHeight: 0.5,
      maxHeight: 0.8,
    }

    const bushMaterial = new THREE.MeshStandardMaterial({
      color: 0x80a040,
      flatShading: true,
    })

    for (let i = 0; i < this.count.bushes; i++) {
      const bushRadius =
        bush.minRadius + Math.random() * (bush.maxRadius - bush.minRadius)
      const bushGeometry = new THREE.SphereGeometry(bushRadius, 8, 8)
      const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial)

      const coords = new THREE.Vector2(
        Math.floor(this.width * Math.random()),
        Math.floor(this.height * Math.random())
      )

      //dont place objects on top of each other
      if (this.#objectMap.get(`${coords.x}-${coords.y}`)) continue

      // to center trees within grid space first floor the number to a whole number then + 0.5 (half a space)
      bushMesh.position.set(coords.x + 0.5, bushRadius, coords.y + 0.5)

      this.bushes.add(bushMesh)

      // store rock position in object map
      this.#objectMap.set(`${coords.x}-${coords.y}`, bushMesh)
    }
  }
}
