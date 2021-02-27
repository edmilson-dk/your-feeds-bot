let db = [];
let session = [];

function addSession(user_id) {
  if (!user_id) return;
  if (session.includes(user_id)) return;

  session.push(user_id);
  console.log(session);
}

function existsSession(user_id) {
  return session.includes(user_id)
    ? true
    : false;
}

function add(user_id, chat_name, chat_id) {
  if (!user_id && !chat_id) return;

  const exists = db.length > 0 
    ? db.filter(item => item.chats.chat_id === chat_id)
    : db;

  if (exists.length > 0) return;

  db.push({
    user_id,
    chats: {
      chat_name,
      chat_id,
    }
  })

  console.log(db);
}

function drop(chat_id) {
  if (!chat_id) return;
  
  db = db.filter(item => item.chats.chat_id !== chat_id);
}

module.exports = {
  add,
  drop,
  addSession,
  existsSession,
}
