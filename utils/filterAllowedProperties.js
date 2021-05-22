// Filter object to include only allowed properties
module.exports = function (object, allowedProperties) {
  return Object.keys(object)
    .filter(key => allowedProperties.includes(key))
    .reduce((filtered, key) => {
      filtered[key] = object[key];
      return filtered;
    }, {});
}
