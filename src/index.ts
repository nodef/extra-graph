// #region TYPES
// =============

// #region HELPERS
// ---------------

/** A bitset where keys (numbers) have associated values, and are lazily updated. */
class LazyPairBitset<T> {
  private _size:    number   = 0;
  private _removed: number[] = [];
  private _keys:    number[] = [];
  private _values:    T[]    = [];


  // #region ABOUT
  // -------------

  /**
   * Get the number of elements in bitset.
   * @returns |this|
   */
  size(): number {
    return this._size;
  }


  /**
   * Check if bitset is empty.
   * @returns |this| == 0
   */
  isEmpty(): boolean {
    return this._size == 0;
  }


  /**
   * Get the keys of bitset.
   * @returns [k₀, k₁, k₂, ...] | [kᵢ, vᵢ] ∈ this
   */
  keys(): number[] {
    return this._keys.slice(0, this._size);
  }


  /**
   * List the keys of bitset.
   * @yields k₀, k₁, k₂, ... | [kᵢ, vᵢ] ∈ this
   */
  *ikeys(): IterableIterator<number> {
    yield* this._keys.slice(0, this._size);
  }


  /**
   * Get the values of bitset.
   * @returns [v₀, v₁, v₂, ...] | [kᵢ, vᵢ] ∈ this
   */
  values(): T[] {
    return this._values.slice(0, this._size);
  }


  /**
   * List the values of bitset.
   * @yields v₀, v₁, v₂, ... | [kᵢ, vᵢ] ∈ this
   */
  *ivalues(): IterableIterator<T> {
    yield* this._values.slice(0, this._size);
  }


  /**
   * Get the entries of bitset.
   * @returns [[k₀, v₀], [k₁, v₁], [k₂, v₂], ...] | [kᵢ, vᵢ] ∈ this
   */
  entries(): [number, T][] {
    var a: [number, T][] = [];
    for (var i=0, I=this.size(); i<I; ++i)
      a.push([this._keys[i], this._values[i]]);
    return a;
  }


  /**
   * List the entries of bitset.
   * @yields [k₀, v₀], [k₁, v₁], [k₂, v₂], ... | [kᵢ, vᵢ] ∈ this
   */
  *ientries(): IterableIterator<[number, T]> {
    for (var i=0, I=this.size(); i<I; ++i)
      yield [this._keys[i], this._values[i]];
  }
  // #endregion


  // #region FOR EACH
  // ----------------

  /**
   * Call a function for each key in bitset.
   * @param fn process function (k)
   */
  forEachKey(fn: (k: number) => void): void {
    for (var i=0, I=this._size; i<I; ++i)
      fn(this._keys[i]);
  }


  /**
   * Call a function for each value in bitset.
   * @param fn process function (v)
   */
  forEachValue(fn: (v: T) => void): void {
    for (var i=0, I=this._size; i<I; ++i)
      fn(this._values[i]);
  }


  /**
   * Call a function for each entry in bitset.
   * @param fn process function ([k, v])
   */
  forEachEntry(fn: (e: [number, T]) => void): void {
    for (var i=0, I=this._size; i<I; ++i)
      fn([this._keys[i], this._values[i]]);
  }


  /**
   * Call a function for each key and value in bitset.
   * @param fn process function (k, v)
   */
  forEach(fn: (k: number, v: T) => void): void {
    for (var i=0, I=this._size; i<I; ++i)
      fn(this._keys[i], this._values[i]);
  }
  // #endregion


  // #region SEARCH KEY
  // ------------------

  /**
   * Check if bitset has key.
   * @param k key
   * @returns kᵢ = k for some i; false otherwise; [kᵢ, vᵢ] ∈ this
   */
  has(k: number): boolean {
    return this._keys.slice(0, this._size).indexOf(k) != -1;
  }


  /**
   * Get the index of key in bitset.
   * @param k key
   * @returns i | kᵢ = k; i = -1 otherwise; [kᵢ, vᵢ] ∈ this
   */
  indexOf(k: number): number {
    return this._keys.indexOf(k);
  }


  /**
   * Get the key at index in bitset.
   * @param i index
   * @returns kᵢ | [kᵢ, vᵢ] ∈ this
   */
  keyAt(i: number): number {
    return this._keys[i];
  }


  /**
   * Get the value at index in bitset.
   * @param i index
   * @returns vᵢ | [kᵢ, vᵢ] ∈ this
   */
  valueAt(i: number): T {
    return this._values[i];
  }


  /**
   * Get the entry at index in bitset.
   * @param i index
   * @returns [kᵢ, vᵢ] | [kᵢ, vᵢ] ∈ this
   */
  entryAt(i: number): [number, T] {
    return [this._keys[i], this._values[i]];
  }
  // #endregion


  // #region ACCESS
  // --------------

  /**
   * Clear the bitset.
   */
  clear(): void {
    this._keys  .length = 0;
    this._values.length = 0;
    this._size = 0;
  }


  /**
   * Get the value of key in bitset.
   * @param k key
   * @param _v default value
   * @returns vᵢ | kᵢ = k; _v otherwise; [kᵢ, vᵢ] ∈ this
   */
  get(k: number, _v: T): T {
    let i = this.indexOf(k);
    return i>=0? this._values[i] : _v;
  }


  /**
   * Set the value of key in bitset.
   * @param k key
   * @param v value
   */
  set(k: number, v: T): void {
    let i = this.indexOf(k);
    if (i<=0) return;
    this._values[i] = v;
  }


  /**
   * Add a key and associated value to bitset.
   * @param k key
   * @param v value
   */
  add(k: number, v: T): void {
    this._keys  .push(k);
    this._values.push(v);
  }


  /**
   * Remove a key from bitset.
   * @param k key
   */
  remove(k: number): void {
    this._removed.push(k);
  }


  /**
   * TODO: Apply the changes to bitset.
   */
  update(): void {
    // Remove keys from bitset.
    // And then, compact the bitset by merging keys[0..size-1] and keys[size..], and values.
  }
  // #endregion
}
// #endregion




// #region GRAPH
// -------------

/** A directed graph that is lazily updated. */
class DiGraph<V, E> {
  private _V: V;
  private _E: E;
  private _n: number;
  private _m: number;
  private _exists: boolean[];
  private _values: V[];
  private _to:   LazyPairBitset<E>[];
  private _from: LazyPairBitset<E>[];


  // #region CONSTRUCTOR
  // -------------------

  /**
   * Create a new graph.
   * @param _V default vertex data
   * @param _E default edge weight
   */
  constructor(_V: V, _E: E) {
    this._V = _V;
    this._E = _E;
    this._n = 0;
    this._m = 0;
    this._exists = [];
    this._values = [];
    this._to     = [];
    this._from   = [];
  }
  // #endregion


  // #region ABOUT
  // -------------

  /**
   * Get the maximum vertex-id of graph.
   * @returns s | s > v for all v ∈ V
   */
  span(): number {
    return this._exists.length;
  }


  /**
   * Get the number of vertices in graph.
   * @returns |V|
   */
  order(): number {
    return this._n;
  }


  /**
   * Get the number of edges in graph.
   * @returns |E|
   */
  size(): number {
    return this._m;
  }


  /**
   * Tell if graph is directed.
   * @returns true
   */
  isDirected(): boolean {
    return true;
  }


  /**
   * Check if graph has a vertex.
   * @param v vertex
   * @returns v ∈ V?
   */
  hasVertex(v: number): boolean {
    return v<this.span() && this._exists[v];
  }


  /**
   * Check if graph has an edge.
   * @param u source vertex
   * @param v target vertex
   * @returns [u, v] ∈ E?
   */
  hasEdge(u: number, v: number): boolean {
    return this.hasVertex(u) && this.hasVertex(v) && this._to[u].has(v);
  }


  /**
   * Obtain the vertex IDs, and associated vertex data in graph.
   * @returns [[v₀, d₀], [v₁, d₁], [v₂, d₂], ...] | vᵢ ∈ V
   */
  vertices(): [number, V][] {
    var a: [number, V][] = [];
    for (var v=0, S=this.span(); v<S; ++v)
      if (this._exists[v]) a.push([v, this._values[v]]);
    return a;
  }


  /**
   * List the vertex IDs, and associated vertex data in graph.
   * @yields [v₀, d₀], [v₁, d₁], [v₂, d₂], ... | vᵢ ∈ V
   */
  *ivertices(): IterableIterator<[number, V]> {
    for (var u=0, S=this.span(); u<S; ++u)
      if (this._exists[u]) yield [u, this._values[u]];
  }


  /**
   * Obtain the vertex IDs in graph.
   * @returns [v₀, v₁, v₂, ...] | vᵢ ∈ V
   */
  vertexKeys(): number[] {
    var a: number[] = [];
    for (var v=0, S=this.span(); v<S; ++v)
      if (this._exists[v]) a.push(v);
    return a;
  }


  /**
   * List the vertex IDs in graph.
   * @yields v₀, v₁, v₂, ... | vᵢ ∈ V
   */
  *ivertexKeys(): IterableIterator<number> {
    for (var v=0, S=this.span(); v<S; ++v)
      if (this._exists[v]) yield v;
  }


  /**
   * Obtain the vertex data in graph.
   * @returns [d₀, d₁, d₂, ...] | vᵢ ∈ V
   */
  vertexValues(): V[] {
    var a: V[] = [];
    for (var v=0, S=this.span(); v<S; ++v)
      if (this._exists[v]) a.push(this._values[v]);
    return a;
  }


  /**
   * List the vertex data in graph.
   * @yields d₀, d₁, d₂, ... | vᵢ ∈ V
   */
  *ivertexValues(): IterableIterator<V> {
    for (var v=0, S=this.span(); v<S; ++v)
      if (this._exists[v]) yield this._values[v];
  }


  /**
   * Obtain the vertex out-degrees in graph.
   * @returns [D⁺₀, D⁺₁, D⁺₂, ...] | uᵢ ∈ V; D⁺ᵢ = |edges(uᵢ)|
   */
  degrees(): number[] {
    var a: number[] = [];
    for (var u=0, S=this.span(); u<S; ++u)
      if (this._exists[u]) a.push(this._to[u].size());
    return a;
  }


  /**
   * List the vertex out-degrees in graph.
   * @yields D⁺₀, D⁺₁, D⁺₂, ... | uᵢ ∈ V; D⁺ᵢ = |edges(uᵢ)|
   */
  *idegrees(): IterableIterator<number> {
    for (var u=0, S=this.span(); u<S; ++u)
      if (this._exists[u]) yield this._to[u].size();
  }


  /**
   * Obtain the vertex in-degrees in graph.
   * @returns [D⁻₀, D⁻₁, D⁻₂, ...] | vᵢ ∈ V; D⁻ᵢ = |inEdges(vᵢ)|
   */
  inDegrees(): number[] {
    var a: number[] = [];
    for (var v=0, S=this.span(); v<S; ++v)
      if (this._exists[v]) a.push(this._from[v].size());
    return a;
  }


  /**
   * List the vertex in-degrees in graph.
   * @yields D⁻₀, D⁻₁, D⁻₂, ... | vᵢ ∈ V; D⁻ᵢ = |inEdges(vᵢ)|
   */
  *iinDegrees(): IterableIterator<number> {
    for (var v=0, S=this.span(); v<S; ++v)
      if (this._exists[v]) yield this._from[v].size();
  }


  /**
   * Obtain the outgoing edge IDs, and associated edge weights for the given vertex in graph.
   * @param u source vertex
   * @returns [[v₀, w₀], [v₁, w₁], [v₂, w₂], ...] | [u, vᵢ] ∈ E; wᵢ = w(u, vᵢ)
   */
  edges(u: number): [number, E][] {
    if (!this.hasVertex(u)) return [];
    return this._to[u].entries();
  }


  /**
   * List the outgoing edge IDs, and associated edge weights for the given vertex in graph.
   * @param u source vertex
   * @yields [v₀, w₀], [v₁, w₁], [v₂, w₂], ... | [u, vᵢ] ∈ E; wᵢ = w(u, vᵢ)
   */
  *iedges(u: number): IterableIterator<[number, E]> {
    if (!this.hasVertex(u)) return;
    yield* this._to[u].ientries();
  }


  /**
   * Obtain the outgoing edge IDs for the given vertex in graph.
   * @param u source vertex
   * @returns [v₀, v₁, v₂, ...] | [u, vᵢ] ∈ E
   */
  edgeKeys(u: number): number[] {
    if (!this.hasVertex(u)) return [];
    return this._to[u].keys();
  }


  /**
   * List the outgoing edge IDs for the given vertex in graph.
   * @param u source vertex
   * @yields v₀, v₁, v₂, ... | [u, vᵢ] ∈ E
   */
  *iedgeKeys(u: number): IterableIterator<number> {
    if (!this.hasVertex(u)) return;
    yield* this._to[u].ikeys();
  }


  /**
   * Obtain the outgoing edge weights for the given vertex in graph.
   * @param u source vertex
   * @returns [w₀, w₁, w₂, ...] | [u, vᵢ] ∈ E; wᵢ = w(u, vᵢ)
   */
  edgeValues(u: number): E[] {
    if (!this.hasVertex(u)) return [];
    return this._to[u].values();
  }


  /**
   * List the outgoing edge weights for the given vertex in graph.
   * @param u source vertex
   * @yields w₀, w₁, w₂, ... | [u, vᵢ] ∈ E; wᵢ = w(u, vᵢ)
   */
  *iedgeValues(u: number): IterableIterator<E> {
    if (!this.hasVertex(u)) return;
    yield* this._to[u].ivalues();
  }


  /**
   * Obtain the incoming edge IDs, and associated edge weights for the given vertex in graph.
   * @param v target vertex
   * @returns [[u₀, w₀], [u₁, w₁], [u₂, w₂], ...] | [uᵢ, v] ∈ E; wᵢ = w(uᵢ, v)
   */
  inEdges(v: number): [number, E][] {
    if (!this.hasVertex(v)) return [];
    return this._from[v].entries();
  }


  /**
   * List the incoming edge IDs, and associated edge weights for the given vertex in graph.
   * @param v target vertex
   * @yields [u₀, w₀], [u₁, w₁], [u₂, w₂], ... | [uᵢ, v] ∈ E; wᵢ = w(uᵢ, v)
   */
  *iinEdges(v: number): IterableIterator<[number, E]> {
    if (!this.hasVertex(v)) return;
    yield* this._from[v].ientries();
  }


  /**
   * Obtain the incoming edge IDs for the given vertex in graph.
   * @param v target vertex
   * @returns [u₀, u₁, u₂, ...] | [vᵢ, u] ∈ E
   */
  inEdgeKeys(v: number): number[] {
    if (!this.hasVertex(v)) return [];
    return this._from[v].keys();
  }


  /**
   * List the incoming edge IDs for the given vertex in graph.
   * @param v target vertex
   * @yields u₀, u₁, u₂, ... | [uᵢ, v] ∈ E
   */
  *iinEdgeKeys(v: number): IterableIterator<number> {
    if (!this.hasVertex(v)) return;
    yield* this._from[v].ikeys();
  }


  /**
   * Obtain the incoming edge weights for the given vertex in graph.
   * @param v target vertex
   * @returns [w₀, w₁, w₂, ...] | [uᵢ, v] ∈ E; wᵢ = w(uᵢ, v)
   */
  inEdgeValues(v: number): E[] {
    if (!this.hasVertex(v)) return [];
    return this._from[v].values();
  }


  /**
   * List the incoming edge weights for the given vertex in graph.
   * @param v target vertex
   * @yields w₀, w₁, w₂, ... | [uᵢ, v] ∈ E; wᵢ = w(uᵢ, v)
   */
  *iinEdgeValues(v: number): IterableIterator<E> {
    if (!this.hasVertex(v)) return;
    yield* this._from[v].ivalues();
  }


  /**
   * Get the out-degree of a vertex in graph.
   * @param u source vertex
   * @returns D⁺ᵤ = |edges(u)|
   */
  degree(u: number): number {
    if (!this.hasVertex(u)) return 0;
    return this._to[u].size();
  }


  /**
   * Get the in-degree of a vertex in graph.
   * @param v target vertex
   * @returns D⁻ᵥ = |inEdges(v)|
   */
  inDegree(v: number): number {
    if (!this.hasVertex(v)) return 0;
    return this._from[v].size();
  }
  // #endregion


  // #region FOR EACH
  // ----------------

  /**
   * Call a function for each vertex in graph.
   * @param fn process function (v, d)
   */
  forEachVertex(fn: (v: number, d: V) => void): void {
    for (var v=0, S=this.span(); v<S; ++v)
      if (this._exists[v]) fn(v, this._values[v]);
  }


  /**
   * Call a function for each outgoing edge of a vertex in graph.
   * @param u source vertex
   * @param fn process function (v, w)
   */
  forEachEdge(u: number, fn: (v: number, w: E) => void): void {
    if (!this.hasVertex(u)) return;
    this._to[u].forEach(fn);
  }


  /**
   * Call a function for each incoming edge of a vertex in graph.
   * @param v target vertex
   * @param fn process function (u, w)
   */
  forEachInEdge(v: number, fn: (u: number, w: E) => void): void {
    if (!this.hasVertex(v)) return;
    this._from[v].forEach(fn);
  }
  // #endregion


  // #region ACCESS
  // --------------

  /**
   * Get the data associated with a vertex in graph.
   * @param v vertex
   * @returns dᵥ | v ∈ V
   */
  vertexValue(v: number): V {
    return this.hasVertex(v)? this._values[v] : this._V;
  }


  /**
   * Set the data associated with a vertex in graph.
   * @param v vertex
   * @param d data
   */
  setVertexValue(v: number, d: V): void {
    if (!this.hasVertex(v)) return;
    this._values[v] = d;
  }


  /**
   * Get the weight of an edge in graph.
   * @param u source vertex
   * @param v target vertex
   * @returns wᵤᵥ | [u, v] ∈ E
   */
  edgeValue(u: number, v: number): E {
    if (!this.hasEdge(u, v)) return this._E;
    return this._to[u].get(v, this._E);
  }


  /**
   * Set the weight of an edge in graph.
   * @param u source vertex
   * @param v target vertex
   * @param w weight
   */
  setEdgeValue(u: number, v: number, w: E): void {
    if (!this.hasEdge(u, v)) return;
    this._to[u]  .set(v, w);
    this._from[v].set(u, w);
  }
  // #endregion


  // #region UPDATE
  // --------------

  /**
   * Clear the graph.
   */
  clear(): void {
    this._n = 0;
    this._m = 0;
    this._exists.length = 0;
    this._values.length = 0;
    this._to    .length = 0;
    this._from  .length = 0;
  }


  /**
   * Adjust the span of graph.
   * @param s new span
   */
  respan(s: number): void {
    var S = this._exists.length;
    var r = Math.min(s, S);
    this._exists.length = r;
    this._values.length = r;
    this._to    .length = r;
    this._from  .length = r;
    for (var v=S; v<s; ++v) {
      this._exists[v] = false;
      this._values[v] = this._V;
      this._to  [v] = new LazyPairBitset<E>();
      this._from[v] = new LazyPairBitset<E>();
    }
  }


  /**
   * Apply changes to the graph.
   */
  update(): void {
    var n = 0, m = 0;
    for (var v=0, S=this._exists.length; v<S; ++v) {
      if (!this._exists[v]) continue;
      this._to  [v].update();
      this._from[v].update();
      m += this._to[v].size();
      ++n;
    }
    this._n = n;
    this._m = m;
  }


  /**
   * Add a vertex to graph.
   * @param v vertex
   * @param d vertex data
   */
  addVertex(v: number, d: V): void {
    var S = this._exists.length;
    if (this.hasVertex(v)) return;
    if (v>=S) this.respan(v+1);
    this._exists[v] = true;
    this._values[v] = d;
    this._to  [v] = new LazyPairBitset<E>();
    this._from[v] = new LazyPairBitset<E>();
  }


  /**
   * Remove a vertex from graph.
   * @param v vertex
   */
  removeVertex(v: number): void {
    if (!this.hasVertex(v)) return;
    this._exists[v] = false;
    this._values[v] = this._V;
    this._to  [v].clear();
    this._from[v].clear();
  }


  /**
   * Add an edge to graph.
   * @param u source vertex
   * @param v target vertex
   * @param w edge weight
   */
  addEdge(u: number, v: number, w: E): void {
    if (!this.hasVertex(u)) this.addVertex(u, this._V);  // PERF: Optimize this away.
    if (!this.hasVertex(v)) this.addVertex(v, this._V);  // PERF: Optimize this away.
    this._to  [u].add(v, w);
    this._from[v].add(u, w);
  }
  // #endregion
}
// #endregion
// #endregion
