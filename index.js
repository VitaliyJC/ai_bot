import OpenAI from "openai";
import { Bot, GrammyError, HttpError } from "grammy";
import * as dotenv from "dotenv";
import { ShowId } from "./components/id.js";
import { ShowErrors } from "./components/error.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env["API_KEY"],
});

const history = [];

const getChat = async (userMessage) => {
  history.push({ role: "user", content: userMessage });
  const res = await openai.chat.completions.create({
    model: "gpt-4-0613",
    messages: history,
  });
  return res.choices[0].message.content;
};

const bot = new Bot(process.env.TELEGRAM_API_KEY);

bot.on("message").filter(
  (ctx) => ctx.from.id !== 405034143,
  async (ctx) => {
    await ctx.reply(
      `Привет ${ctx.from.first_name}, для того чтобы пообщаться со мной, тебе необходимо написать <a href="https://t.me/VitaliyJC">Виталию</a>, чтобы он нас познакомил.`,
      {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }
    );
  }
);

bot.api.setMyCommands([
  { command: "id", description: "Узнать свой ID Telegram" },
  {
    command: "delete_history",
    description: "Удаление истории переписки (контекста)",
  },
]);

bot.command("delete_history", async () => {
  history.splice(0, history.length);
});

ShowId(bot);

bot.on("message").filter(
  (ctx) => ctx.from.id === 405034143,
  async (ctx) => {
    let userMessage = ctx.message.text;
    let chat = await getChat(userMessage);
    await ctx.reply(chat);
  }
);

ShowErrors(bot);

bot.start();
