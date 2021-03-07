async function asyncFilter(array, cb) {
  const results = await Promise.all(array.map(cb));

  return array.filter((_, index) => results[index]);
}

function isHashtagsValid(hashtags) {
  if (hashtags.length === 0) return false;

  const hashtagsValids = hashtags.filter(hashtag => hashtag[0] === '#');
  
  return hashtagsValids.length < hashtags.length 
    ? false
    : true;
}

function removeSpacesInArray(array) {
  if (array.length === 0) return;

  const newArray = array.filter(item => item !== '');

  return newArray;
}

module.exports = {
  asyncFilter,
  isHashtagsValid,
  removeSpacesInArray,
}