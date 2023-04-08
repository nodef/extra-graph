import * as lists from "./_lists";




export class LazyBitset<K, V> {
  private _keys:   K[] = [];
  private _values: V[] = [];
  private _unprocessed: number = 0;

  // Access get operations.
  public get(key: K, _value: V): V {
    let i = this._keys.indexOf(key);
    return i>=0? this._values[i] : _value;
  }

  // Access set operations.
  public set(key: K, value: V): void {
    let i = this._keys.indexOf(key);
    if (i>=0) {
      this._values[i] = value;
    } else {
      this._keys  .push(key);
      this._values.push(value);
    }
  }

  // Update operations.
  private _updateRemove(): void {
    let n = this.size() + this._unprocessed;
    let rkeys   = this._keys.slice(n);
    let rvalues = this._values.slice(n);
    this._keys  .length = n;
    this._values.length = n;
    xlists.sort$([rkeys, rvalues]);  // TODO
    n = xsortedLists.difference$([this._keys, this._values], [rkeys, rvalues]);
    this._keys  .length = n;
    this._values.length = n;
    this._unprocessed = 0
  }

  private _updateAdd(): void {
    let n = this.size() + this._unprocessed;
    let akeys   = this._keys.slice(n);
    let avalues = this._values.slice(n);
    this._keys  .length = n;
    this._values.length = n;
    xlists.sort$([akeys, avalues]);
    n = xsortedLists.union$([this._keys, this._values], [akeys, avalues]);
    this._keys  .length = n;
    this._values.length = n;
    this._unprocessed = 0
  }

  public clear(): void {
    this._keys  .length = 0;
    this._values.length = 0;
    this._unprocessed = 0;
  }

  public update(): void {
    if (this._unprocessed===0) return;
    if (this._unprocessed < 0) this._updateRemove();
    else                       this._updateAdd();
  }

  public remove(key: K): void {
    if (this._unprocessed>0) this._updateAdd();
    this._keys  .push(key);
    this._values.push(undefined);
    --this._unprocessed;
  }

  public add(key: K, value: V): void {
    if (this._unprocessed<0) this._updateRemove();
    this._keys  .push(key);
    this._values.push(value);
    ++this._unprocessed;
  }

  public toString(): string {
    return this.entries().toString();
  }
}
