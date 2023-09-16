#!/usr/bin/env node
import { Game } from "./game";
import { listenCliKey } from "./listen";
import prompts from 'prompts'
import { i18n } from './i18n';


async function bootstrap() {
  const response = await prompts({
    type: 'select',
    name: 'lang',
    message: 'Pick a language / 选择语言',
    choices: [
      { title: 'English', value: 'en_us' },
      { title: '中文', value: 'zh_cn' },
    ],
    initial: 1
  });

  const i = i18n[response.lang as keyof typeof i18n] ?? i18n.en_us;

  const debug = process.env.DEBUG;
  if (debug) {
    console.log(`${i.model}: ${i.debug}`);
  }
  console.log(i.startHelp);
  console.log(i.start);
  const key = await listenCliKey();
  if (!key) {
    console.log(i.break);
    process.exit();
  }
  const game = new Game();

  game.AddElement();
  game.AddElement();

  while (true) {
    if (game.IsOver()) {
      break;
    }

    game.AddElement();
    game.Display();
    await game.TakeInput();
  }

  console.log(`**** ${i.over} ****`);
  const { maximum, total } = game.CountScore();
  console.log(`${i.scoreMax}: `, maximum);
  console.log(`${i.scoreTotal}: `, total);
  process.exit();
}

bootstrap();
