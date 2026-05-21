/**
 * Checks if two rectangles overlap
 * 
 * used for collision detection across the game
 * @param {Object} a - first rectangle
 * @param {Object} b - second rectangle
 * @returns {boolean} - true if overlap, otherwise false
 */
function rectCollision(a,b) {
    return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * Check if rectangle overlaps with any obstacle
 * 
 * used for movement restriction
 * @param {Object} rect - test subject
 * @param {Array} obstacles - obstacles to check
 * @returns {boolean} - true if collides, otherwise false
 */
function collidesWithAny(rect, obstacles) {
  for (let obstacle of obstacles) {
    if (rectCollision(rect, obstacle)) {
      return true;
    }
  }
  return false;
}

