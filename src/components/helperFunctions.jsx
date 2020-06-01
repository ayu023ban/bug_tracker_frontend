function filter(obj, keys) {
    let result = {}
    keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    });
    return result;
}
export { filter }