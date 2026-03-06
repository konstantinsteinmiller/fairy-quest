export const mergeObjectsRecursive = (obj1: any, obj2: any) => {
  ;[...Object.keys(obj2)].forEach(key => {
    try {
      if (obj2[key].constructor == Object) {
        obj1[key] = mergeObjectsRecursive(obj1[key], obj2[key])
      } else {
        obj1[key] = obj2[key]
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[key] = obj2[key]
    }
  })

  return obj1
}