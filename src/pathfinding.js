import * as THREE from "three"
import { World } from "./world"

const getKey = (coords) => `${coords.x}-${coords.y}`

/**
 *
 * @param {THREE.Vector2} start
 * @param {THREE.Vector2} end
 * @param {World} world
 */
export function search(start, end, world) {
  // if the end is equal to the start, return
  if (start.x === end.x && start.y === end.y) return []

  const maxSearchDistance = 20
  const visited = new Set()
  const frontier = [start]

  while (frontier.length > 0) {
    // get the square with the shortest distance metric
    // Dijkstra - distance to origin
    // A* - distance to origin + distance to destination

    frontier.sort((a, b) => {
      const distanceA = start.manhattanDistanceTo(a)
      const distanceB = start.manhattanDistanceTo(b)

      return distanceA - distanceB
    })

    const candidate = frontier.shift()

    // did we find the end goal?
    if (candidate.x === end.x && candidate.y === end.y) {
      break
    }

    // mark this square as visited
    visited.add(getKey(candidate))

    // if we have exceeded the max search distance, skip to next candidate
    if (candidate.manhattanDistanceTo(start) > maxSearchDistance) {
      continue
    }

    // search the neighbouts of the square
    const neighbours = getNeighbours(candidate, world, visited)
    frontier.push(...neighbours)
  }
}

/**
 *
 *
 * @param {THREE.Vector2} coords
 * @param {World} world
 *
 */
function getNeighbours(coords, world, visited) {
  const neighbours = []

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

  // exclude any sqwuares that have already been visited
  neighbours = neighbours.filter((coords) => !visited.has(getKey(coords)))
  return neighbours
}
