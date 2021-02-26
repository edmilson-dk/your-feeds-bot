const getChatId = (ctx) => ctx.chat.id;

async function isAdmin(memberId, ctx) {
  const { status } = await ctx.getChatMember(memberId);
  const result = status === 'creator' || status === 'administrator';

  return result;
}

async function isBotAdmin(ctx){
  const botId = ctx.botInfo.id;
  const result = await isAdmin(botId, ctx);

  return result;
}

module.exports = { 
  getChatId,
  isAdmin,
  isBotAdmin,
};
