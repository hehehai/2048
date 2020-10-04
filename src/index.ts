#!/usr/bin/env node
import { Game } from "./game";
import { listenCliKey } from "./listen";

async function bootstrap() {
  const debug = process.env.DEBUG;
  if (debug) {
    console.log("model: debug");
  }
  console.log("Use {W A S D} or {h j k l} or Arrow keys to move the board");
  console.log("Press any key to start");
  const key = await listenCliKey();
  if (!key) {
    console.log("break game input");
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

  console.log("**** Game Over ****");
  const { maximum, total } = game.CountScore();
  console.log("Score: Max Tile Value: ", maximum);
  console.log("Score: Total Tiles Value: ", total);
  process.exit();
}

bootstrap();
