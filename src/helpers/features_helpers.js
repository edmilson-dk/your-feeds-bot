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

function removeNotHashtagsInArray(array) {
  if (array.length === 0) return;

  const newArray = array.filter(item => item[0] === '#');
  return newArray;
}

async function listFeeds(feeds) { 
  let feedsList = '<strong>Feeds 📌</strong>\n';

  if (feeds && feeds.length > 0) {
    feeds.forEach(feed => {
      feedsList += `\n🔹 <code>${feed.title}</code>\n`
    })
  }

  return feedsList;
}

async function listChats(chats) {
  let chatsList = '<strong>Chats 📌</strong>\n';

  if (chats && chats.length > 0) {
    chats.forEach(chat => {
      chatsList += `\n🔸 <code>${chat.title}</code>\n`;
    })
  }

  return chatsList;
}

function formatToString(fields) {
  if (typeof fields !== 'object') return;

  return fields.map(item => {
    if (typeof item !== 'string') return String(item);
    return item;
  })
}

function getFeedStyleTagData(data) {
  const key = Object.keys(data)[0];
  const value = Object.values(data)[0];

  const newKey = key.split('Tag').join('_tag');

  return { [newKey]: value };
}

module.exports = {
  asyncFilter,
  isHashtagsValid,
  removeSpacesInArray,
  removeNotHashtagsInArray,
  listFeeds,
  listChats,
  formatToString,
  getFeedStyleTagData,
}