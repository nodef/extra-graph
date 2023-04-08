// LISTS
// -----
// An entry with key array and value array.


export type Lists<K, V> = [K[], V[]];




// Clear the lists.
export function clear$<K, V>(x: Lists<K, V>): Lists<K, V> {
  x[0].length = 0;
  x[1].length = 0;
  return x;
}


export function sort$<K, V>(x: Lists<K, V>): Lists<K, V> {
  x[0].sort();
  x[1].sort();
  return x;
}


// Set difference of two lists.
export function difference$<K, V>(x: Lists<K, V>, y: Lists<K, V>) {
  let xb = 0, xe = x[0].length;
  let yb = 0, ye = y[0].length;
  if (xb==xe || yb==ye) return xe;
  while (true) {
    while (x[0][xb] < y[0][yb])
    { if (++xb==xe) return xe; }
    if (x[0][xb] > y[0][yb++]) break;
    if (++yb==ye) return xe;
  }
  let it = xb++;
  if (xb==xe) return it;
  while (yb!=ye) {
    while (x[0][xb] < y[0][yb]) {
      x[0][it] = x[0][xb];
      x[1][it] = x[1][xb];
      it++;
      if (++xb==xe) return it;
    }
    if (x[0][xb] > y[0][yb++])
    { if (++xb==xe) return it; }
  }
  return it;
}


/*
// Remove from `x`, elements given in `y`.
// Both `x` and `y` must be sorted.
template <class IX, class IY, class FL, class FE>
auto set_difference_inplace(IX xb, IX xe, IY yb, IY ye, FL fl, FE fe) {
  if (xb==xe || yb==ye) return xe;
  // Write-free loop when there is
  // nothing to remove.
  while (true) {
    while (fl(*xb, *yb))
    { if (++xb==xe) return xe; }
    if (fe(*xb, *(yb++))) break;
    if (yb==ye) return xe;
  }
  // There was a match, remove it.
  IX it = xb++;
  // Only one element needs removal.
  if (xb==xe) return it;
  // With-write loop when there are
  // more elements to remove.
   while (yb!=ye) {
    while (fl(*xb, *yb)) {
      *(it++) = *xb;
      if (++xb==xe) return it;
    }
    if (fe(*xb, *(yb++)))
    { if (++xb==xe) return it; }
  }
  // No more elements to remove.
  // Shift the remaining elements.
  return copy(xb, xe, it);
}
*/
