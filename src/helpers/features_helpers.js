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

function validateTimes(time, isInterval = false) {
  const times = time.split(':');
  const hours = times[0]; 

  if (times.length < 2) return false;

  if (isInterval) {   
     if (Number(hours) < process.env.BOT_POST_INTERVAL_MIN) return false;
     if (Number(hours) > process.env.BOT_POST_INTERVAL_MAX) return false;
     return true;
   }

   if (hours === '00') return true;
   if (hours === '0') return false;
   if (Number(hours) < process.env.BOT_POST_TIME_MIN) return false;
   if (Number(hours) > process.env.BOT_POST_TIME_MAX) return false;

   return true;
}

function formatTimes(time) {
  const timeFormatted = time.split(':');
  const [ hours, minutes] = timeFormatted;
 
  if (hours === '0') return `${hours}0:00`;
  return `${hours}:00`;
}

function isAppropriateTime(startTime, endTime, intervalTime) {
  const [ startHours, minutes ] = startTime.split(':');
  const [ endHours, minutes ] = endTime.split(':');
  const [ intervalHours, minutes ] = intervalTime.split(':');
  const totalTime = Number(startHours) - Number(endHours);
  console.log(totalTime);

 // if (startTime === endTime) return true;
}

module.exports = {
  asyncFilter,
  isHashtagsValid,
  removeSpacesInArray,
  removeNotHashtagsInArray,
  listFeeds,
  listChats,
  validateTimes,
  formatTimes,
}