function lerp(A, B, t) {
  return A + (B - A) * t;
}

// get intersection of two line segments AB and CD
function getIntersection(A, B, C, D) {
  const denominator = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
  if (denominator == 0) {
    return null;
  }

  const t =
    ((D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)) / denominator;
  const u =
    ((C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y)) / denominator;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: lerp(A.x, B.x, t),
      y: lerp(A.y, B.y, t),
      offset: t,
    };
  } else {
    return null;
  }
}

function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      if (
        getIntersection(
          poly1[i],
          poly1[(i + 1) % poly1.length],
          poly2[j],
          poly2[(j + 1) % poly2.length]
        )
      ) {
        return true;
      }
    }
  }
  return false;
}
