const { setStylesContentFeedsMarkup, setStylesDescriptionFeedsMarkup, setStylesTitleFeedsMarkup } = require('../markups');
const { getChatId, getUserCallbackId } = require('../helpers/bot_helpers');

const feedStyleServices = require('../infra/adapters/feed-style-adapter');
const chatServices = require('../infra/adapters/chat-adapter');
const { stylesFeedIdentifier } = require('../constants');
const { getTagType } = require('../helpers/features_helpers');

module.exports = ({ bot }) => {
  
  async function setFeedStyle(ctx, data) {
    const userId = getUserCallbackId(ctx);
    const chatId = await chatServices.getIsActiveConfigChat({ userId });

    if (!(await feedStyleServices.existsFeedStyles({ chatId }))) {
      await feedStyleServices.addStyles(data, chatId);
    } else {
      await feedStyleServices.updateStyles(data, chatId);
    }

    ctx.telegram.sendMessage(getChatId(ctx), 
      '✅ Novo estilo do feed adicionado com sucesso!', 
      setStylesTitleFeedsMarkup);
  }

  bot.action('style_title', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    const userId = getUserCallbackId(ctx);  
    const chatId = await chatServices.getIsActiveConfigChat({ userId });
    const { title_tag } = await feedStyleServices.getStyles({ chatId });

    ctx.telegram.sendMessage(getChatId(ctx), 
    `Escolha um estilo para os titúlos abaixo 📌
    \nEstilo da fonte atual é: ${getTagType(title_tag)} ✅`, 
    setStylesTitleFeedsMarkup);
  })

  bot.action('style_description', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), 
    `Escolha um estilo para as descrições abaixo 📌
    \nEstilo da fonte atual é: ${getTagType(title_tag)} ✅`, 
    setStylesDescriptionFeedsMarkup);
  })

  bot.action('style_content', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), 
    `Escolha um estilo para os conteúdos abaixo 📌
    \nEstilo da fonte atual é: ${getTagType(title_tag)} ✅`,
     setStylesContentFeedsMarkup);
  });

  bot.action('title_italic', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    const { tag } = stylesFeedIdentifier.italic;
    await setFeedStyle(ctx, { titleTag: tag });

    return;
  })

  bot.action('title_bold', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    const { tag } = stylesFeedIdentifier.bold;
    await setFeedStyle(ctx, { titleTag: tag });

    return;
  })
  
  bot.action('title_mono', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    
    const { tag } = stylesFeedIdentifier.monospace;
    await setFeedStyle(ctx, { titleTag: tag });

    return;
  })

  bot.action('title_default', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    
    const { tag } = stylesFeedIdentifier.default;
    await setFeedStyle(ctx, { titleTag: tag });

    return;
  })

  // description 

  bot.action('description_italic', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    const { tag } = stylesFeedIdentifier.italic;
    await setFeedStyle(ctx, { descriptionTag: tag });

    return;
  })

  bot.action('description_bold', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    const { tag } = stylesFeedIdentifier.bold;
    await setFeedStyle(ctx, { descriptionTag: tag });

    return;
  })
  
  bot.action('description_mono', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    
    const { tag } = stylesFeedIdentifier.monospace;
    await setFeedStyle(ctx, { descriptionTag: tag });

    return;
  })

  bot.action('description_default', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    
    const { tag } = stylesFeedIdentifier.default;
    await setFeedStyle(ctx, { descriptionTag: tag });

    return;
  })

   // content

   bot.action('content_italic', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    const { tag } = stylesFeedIdentifier.italic;
    await setFeedStyle(ctx, { contentTag: tag });

    return;
  })

  bot.action('content_bold', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    const { tag } = stylesFeedIdentifier.bold;
    await setFeedStyle(ctx, { contentTag: tag });

    return;
  })
  
  bot.action('content_mono', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    
    const { tag } = stylesFeedIdentifier.monospace;
    await setFeedStyle(ctx, { contentTag: tag });

    return;
  })

  bot.action('content_default', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    
    const { tag } = stylesFeedIdentifier.default;
    await setFeedStyle(ctx, { contentTag: tag });

    return;
  })
}