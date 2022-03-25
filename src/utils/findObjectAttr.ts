export function getValue(obj: any, tarKey: string, nowPar: string, tarParkey?: string, exactly: boolean = false) {
  var rValue = 'Error'
  if (obj) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] == 'object') {
        var nValue = getValue(obj[key], tarKey, key, tarParkey ? tarParkey : void (0), exactly)
        if (nValue != "Error") {
          rValue = nValue
        }
      } else {
        if (key == tarKey && (!tarParkey || (!exactly && nowPar.indexOf(tarParkey) != -1) || (exactly && nowPar == tarParkey))) {
          rValue = obj[key].toString();
        }
      }
    });
  }
  return rValue
}


export function setValue(obj: any, tarKey: string, value: any, nowPar: string, tarParkey?: string, exactly: boolean = false) {
  if (obj) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] == 'object' && obj[key]) {
        setValue(obj[key], tarKey, value, key, tarParkey ? tarParkey : void (0), exactly)
      } else {
        if (key == tarKey && (!tarParkey || (!exactly && nowPar.indexOf(tarParkey) != -1) || (exactly && nowPar == tarParkey))) {
          obj[key] = value;
          console.log(obj[key])
        }
      }
    });
  } 
}

export function setValues(obj: any, value: any) {
  Object.keys(obj).forEach(key => {
    obj[key] = value
  });
}

export function getEventBuffs(obj: any) {
  const eventAndFunction: any = []
  Object.keys(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      const event = key
      const buffs: any = []
      const nowEventObj = obj[key]
      Object.keys(nowEventObj).forEach(key => {
        buffs.push(nowEventObj[key])
      })
      eventAndFunction.push({ event: event, buffs: buffs })
    } else {
    }
  });
  return eventAndFunction
}

/** 默认返回枚举类型的keys */
export function getEnumKeysOrValue(e: any, targetKeys = true, kTv = false) {
  const keys: any = []
  for (var i in e) {
    var kv: any = i
    if (isNaN(kv) != targetKeys) {
      var argsAnyType: any = e[i];
      var argsEnum: any = argsAnyType;
      keys.push(argsEnum)
    } else {
      if (kTv) {
        keys.push(i)
      }

    }
  }
  return keys;
}

