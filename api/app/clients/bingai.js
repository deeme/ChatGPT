require('dotenv').config();
const { KeyvFile } = require('keyv-file');

const askBing = async ({
  text,
  parentMessageId,
  conversationId,
  jailbreak,
  jailbreakConversationId,
  context,
  systemMessage,
  conversationSignature,
  clientId,
  invocationId,
  toneStyle,
  token,
  onProgress
}) => {
  const { BingAIClient } = await import('@waylaidwanderer/chatgpt-api');
  const store = {
    store: new KeyvFile({ filename: './data/cache.json' })
  };

  // 新增一个数组，存储多个BINGAI_TOKEN
  const tokens = [
    process.env.BINGAI_TOKEN,
    process.env.BINGAI_TOKEN1,
    process.env.BINGAI_TOKEN2,
    process.env.BINGAI_TOKEN3
    // 可以添加更多的BINGAI_TOKEN
  ];

  // 新增一个变量，记录当前使用的BINGAI_TOKEN的索引
  let tokenIndex = 0;

  // 新增一个函数，每隔三小时切换到下一个BINGAI_TOKEN
  const switchToken = () => {
    // 索引加一
    tokenIndex++;
    // 如果索引超过了数组的长度，就从头开始
    if (tokenIndex >= tokens.length) {
      tokenIndex = 0;
    }
    // 设置一个定时器，三小时后再次调用这个函数
    setTimeout(switchToken, 3 * 60 * 60 * 1000);
  };

  // 调用一次这个函数，开始切换BINGAI_TOKEN
  switchToken();

  const bingAIClient = new BingAIClient({
    // "_U" cookie from bing.com
    // userToken:
    //   process.env.BINGAI_TOKEN == 'user_provided' ? token : process.env.BINGAI_TOKEN ?? null,
    // If the above doesn't work, provide all your cookies as a string instead
    // 使用数组中的当前BINGAI_TOKEN
    //cookies: process.env.BINGAI_TOKEN == 'user_provided' ? token : process.env.BINGAI_TOKEN ?? null,
    cookies: tokens[tokenIndex] == 'user_provided' ? token : tokens[tokenIndex] ?? null,
    debug: false,
    cache: store,
    host: process.env.BINGAI_HOST || null,
    proxy: process.env.PROXY || null
  });

  let options = {};

  if (jailbreakConversationId == 'false') {
    jailbreakConversationId = false;
  }

  if (jailbreak)
    options = {
      jailbreakConversationId: jailbreakConversationId || jailbreak,
      context,
      systemMessage,
      parentMessageId,
      toneStyle,
      onProgress
    };
  else {
    options = {
      conversationId,
      context,
      systemMessage,
      parentMessageId,
      toneStyle,
      onProgress
    };

    // don't give those parameters for new conversation
    // for new conversation, conversationSignature always is null
    if (conversationSignature) {
      options.conversationSignature = conversationSignature;
      options.clientId = clientId;
      options.invocationId = invocationId;
    }
  }

  console.log('bing options', options);

  const res = await bingAIClient.sendMessage(text, options);

  return res;

  // for reference:
  // https://github.com/waylaidwanderer/node-chatgpt-api/blob/main/demos/use-bing-client.js
};

module.exports = { askBing };
