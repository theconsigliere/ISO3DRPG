import * as THREE from "three"
import { World } from "./world"

const getKey = (coords) => `${coords.x}-${coords.y}`

/**
 *
 * @param {THREE.Vector2} start
 * @param {THREE.Vector2} end
 * @param {World} world
 * @returns {THREE.Vector2[] | null} if path is found, returns the array of coordinates, that make up the path otherwise null
 */
export function search(start, end, world) {
  // if the end is equal to the start, return
  if (start.x === end.x && start.y === end.y) return []

  let pathFound = false
  const maxSearchDistance = 20

  const cameFrom = new Map()
  const cost = new Map()
  const frontier = [start]
  cost.set(getKey(start), 0)

  let counter = 0
  while (frontier.length > 0) {
    // get the square with the shortest distance metric
    // Dijkstra - distance to origin
    // A* - distance to origin + distance to destination

    frontier.sort((v1, v2) => {
      const g1 = start.manhattanDistanceTo(v1)
      const g2 = start.manhattanDistanceTo(v2)
      const h1 = v1.manhattanDistanceTo(end)
      const h2 = v2.manhattanDistanceTo(end)
      const f1 = g1 + h1
      const f2 = g2 + h2
      return f1 - f2
    })

    const candidate = frontier.shift()

    counter++

    // did we find the end goal?
    if (candidate.x === end.x && candidate.y === end.y) {
      pathFound = true
      break
    }

    // if we have exceeded the max search distance, skip to next candidate
    if (candidate.manhattanDistanceTo(start) > maxSearchDistance) {
      continue
    }

    // search the neighbouts of the square
    const neighbours = getNeighbours(candidate, world, cost)
    frontier.push(...neighbours)

    // mark which square each nieghbour came from
    neighbours.forEach((neighbour) => {
      cameFrom.set(getKey(neighbour), candidate)
    })
  }

  if (!pathFound) return null
  // reconstruct the path
  let curr = end
  const path = [curr]

  while (getKey(curr) !== getKey(start)) {
    const prev = cameFrom.get(getKey(curr))
    path.push(prev)
    curr = prev
  }

  path.reverse()
  path.shift()

  return path
}

/**
 *
 *
 * @param {THREE.Vector2} coords
 * @param {World} world
 * @param {Map} cost
 *
 */
function getNeighbours(coords, world, cost) {
  let neighbours = []

  //left
  if (coords.x > 0) neighbours.push(new THREE.Vector2(coords.x - 1, coords.y))

  //right
  if (coords.x < world.width - 1)
    neighbours.push(new THREE.Vector2(coords.x + 1, coords.y))

  //up
  if (coords.y > 0) neighbours.push(new THREE.Vector2(coords.x, coords.y - 1))

  //down
  if (coords.y < world.height - 1)
    neighbours.push(new THREE.Vector2(coords.x, coords.y + 1))

  // cost to get to neighbour square is current square cost + 1
  const newCost = cost.get(getKey(coords)) + 1

  // exclude any sqwuares that have already been visited
  // exclude any squares that are not walkable
  neighbours = neighbours
    .filter((coords) => {
      // if neighbouring dsquare not yet been visited
      // or is a cheaper path couse, then include it in the seradh
      if (!cost.has(getKey(coords)) || newCost < cost.get(getKey(coords))) {
        cost.set(getKey(coords), newCost)
        return true
      } else {
        return false
      }
    })
    .filter((coords) => !world.getObject(coords))

  return neighbours
}
