async function asyncFilter(array, cb) {
  const results = await Promise.all(array.map(cb));

  return array.filter((_, index) => results[index]);
}

module.exports = {
  asyncFilter,
}