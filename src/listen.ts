import { createInterface, emitKeypressEvents } from "readline";
import { moveKey } from "./game";

const term = createInterface({
  input: process.stdin,
  output: process.stdout,
});

emitKeypressEvents(process.stdin)

export async function listenCliKey() {
  process.stdin.setRawMode(true);
  term.resume();
  return new Promise<string>((resolve) => {
    process.stdin.once("keypress", (_, key) => {
      process.stdin.removeListener("keypress", () => {})
      if (key && key.ctrl && key.name === 'c') {
        term.close()
        process.exit()
      }
      resolve(key.name);
    });
  });
}

export async function getMoveKey(): Promise<moveKey> {
  const keyboardMoveType: { [key: string]: moveKey } = {
    a: moveKey.left,
    h: moveKey.left,
    left: moveKey.left,
    d: moveKey.right,
    l: moveKey.right,
    right: moveKey.right,
    w: moveKey.up,
    k: moveKey.up,
    up: moveKey.up,
    s: moveKey.down,
    j: moveKey.down,
    down: moveKey.down,
  };

  const key = await listenCliKey();
  if (!key) {
    return moveKey.noDir;
  }
  return keyboardMoveType[key] || moveKey.noDir;
}
