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

async function listFeeds(feedRepository, chatID) {
  const feeds = await feedRepository.getFeeds(chatID);
  
  let feedsList = '<strong>Feeds 📌</strong>\n';
  if (feeds && feeds.length > 0) {
    feeds.forEach(feed => {
      feedsList += `\n🔹 <i>${feed.title}</i>\n`
    })
  }

  return feedsList;
}

async function listChats(chatRepository, userID) {
  const chats = await chatRepository.getAllChatOfUser(String(userID));
  
  let chatsList = '<strong>Chats 📌</strong>\n';
  if (chats && chats.length > 0) {
    chats.forEach(chat => {
      chatsList += `\n🔸 <i>${chat.title}</i>\n`;
    })
  }

  return chatsList;
}

module.exports = {
  asyncFilter,
  isHashtagsValid,
  removeSpacesInArray,
  removeNotHashtagsInArray,
  listFeeds,
  listChats,
}