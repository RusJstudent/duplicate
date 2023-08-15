'use strict';

function duplicate(obj) {
    let visited = new Set();

    return function makeClone(obj) {
        if (obj === null || typeof obj !== 'object' || visited.has(obj)) return obj;

        if (obj instanceof Date) return new Date(obj.getTime());

        visited.add(obj);

        if (obj instanceof Map) {
            let map = new Map();

            for (let [key, value] of obj) {
                if (typeof key === 'object') key = makeClone(key);
                if (typeof value === 'object') value = makeClone(value);    

                map.set(key, value);
            }

            visited.delete(obj);
            return map;
        }

        if (obj instanceof Set) {
            let set = new Set();

            for (let key of obj) {
                if (typeof key === 'object') key = makeClone(key);

                set.add(key);
            }

            visited.delete(obj);
            return set;
        }

        let cloneObj = new obj.constructor();

        if (Object.getPrototypeOf(obj) !== obj.constructor.prototype) {
            Object.setPrototypeOf(cloneObj, Object.getPrototypeOf(obj));
        }
    
        let descriptors = Object.getOwnPropertyDescriptors(obj);
    
        for (let [key, descriptor] of Object.entries(descriptors)) {
            if (!descriptor.get && !descriptor.set) {
                descriptor.value = makeClone(descriptor.value);
            }

            Object.defineProperty(cloneObj, key, descriptor);
        }
        
        visited.delete(obj);
        return cloneObj;
    }(obj);
}