const getChatId = (ctx) => ctx.chat.id;

async function isAdmin(memberId, ctx) {
  const { status } = await ctx.getChatMember(memberId);
  const result = status === 'creator' || status === 'administrator';

  return result;
}

async function isStillMemberAndAdmin(chatId, memberId, { bot }) {
  try {
    const { status } = await bot.telegram.getChatMember(chatId, memberId);
    const result = status === 'creator' || status === 'administrator';

    return result;
  } catch (err) {
    return false;
  }
}

async function isBotAdmin(ctx){
  const botId = ctx.botInfo.id;
  const result = await isAdmin(botId, ctx);

  return result;
}

function getUserId(ctx, type) {
  switch (type) {
    case 'action':
      return ctx.update.callback_query.from.id; 
    case 'command':
      return ctx.from.id;
  }
}

function removeCommand(message, cmd) {
  const newMessage = message.replace(cmd, '').trim();
  return newMessage;
}

module.exports = {
  isAdmin,
  isBotAdmin,
  getChatId,
  getUserId,
  isStillMemberAndAdmin,
  removeCommand
};