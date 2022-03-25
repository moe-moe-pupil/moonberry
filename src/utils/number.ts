export function hasDot(num: number) {
  if (!isNaN(num)) {
    return ((num + '').indexOf('.') != -1);
  }
}

export function randomRangeInt(min: number, max: number) {
  return Math.ceil((Math.random() * (max - min + 1)) + min - 1);
}

export function InsertSort(tar: number[], l: number, r: number) {
  for (var i = l + 1; i < r; ++i) {
    const tmp = tar[i]
    var j = i - 1
    while (j >= l && tar[j] > tmp) {
      tar[j + 1] = tar[j];
      --j;
    }
    tar[j + 1] = tmp
  }
}

export function swap(tar: number[], a: number, b: number) {
  const tmp = tar[a]
  tar[a] = tar[b]
  tar[b] = tmp
}

export function GetPivot(tar: number[], l: number, r: number) {
  var cnt = 0;
  for (var x = l; x + 5 < r; x += 5) {
    InsertSort(tar, x, x + 5)
    swap(tar, l + cnt, x + 2)
    ++cnt;
  }
  if (x < r) {
    InsertSort(tar, x, r)
    swap(tar, l + cnt, Math.floor((x + r) / 2))
    ++cnt;
  }
  if (1 == cnt) {
    return
  }
  GetPivot(tar, l, l + cnt)
}

export function BFPTR(tar: number[], l: number, r: number, k: number): number {
  if (r - l == 1) {
    return l
  }
  GetPivot(tar, l, r);
  const pivot = tar[l];
  var i = l - 1;
  var j = r;
  while (i < j) {

    do { ++i } while (tar[i] < pivot);
    do { --j } while (tar[j] > pivot);
    if (i < j) {
      swap(tar, i, j)
    }

  }
  if (j - l + 1 >= k) {
    return BFPTR(tar, l, j + 1, k)
  } else {
    return BFPTR(tar, j + 1, r, k - j + l - 1);
  }
}


export function formatFloat(num: number | string, n: number): number | boolean {
  if (typeof num == 'string') {
    var f = parseFloat(num);
  } else {
    f = num
  }
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(f * Math.pow(10, n)) / Math.pow(10, n); // n 幂   
  var s = f.toString();
  var rs = s.indexOf('.');
  //判定如果是整数，增加小数点再补0
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + n) {
    s += '0';
  }
  return parseFloat(s);
}  
