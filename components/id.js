export const ShowId = (bot) => {
  bot.command("id", async (ctx) => {
    await ctx.reply(`Ваш telegram ID: ${ctx.from.id}`);
  });
};
