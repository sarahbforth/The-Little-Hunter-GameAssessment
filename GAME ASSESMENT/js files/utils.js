function rectCollision(a,b) {
    return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function collidesWithAny(rect, obstacles) {
  for (let obstacle of obstacles) {
    if (rectCollision(rect, obstacle)) {
      return true;
    }
  }
  return false;
}

