import { createInterface, emitKeypressEvents } from "readline";
import { MOVE_KEY } from "./game";

const term = createInterface({
  input: process.stdin,
  output: process.stdout,
});

emitKeypressEvents(process.stdin)

/**
 * Listens for a keypress in the CLI and returns the name of the key pressed.
 *
 * @return {Promise<string>} The name of the key pressed.
 */
export async function listenCliKey() {
  process.stdin.setRawMode(true);
  term.resume();
  return new Promise<string>((resolve) => {
    process.stdin.once("keypress", (_, key) => {
      process.stdin.removeListener("keypress", () => { })
      if (key && key.ctrl && key.name === 'c') {
        term.close()
        process.exit()
      }
      resolve(key.name);
    });
  });
}

/**
 * Retrieves the move key based on the keyboard input.
 *
 * @return {Promise<MOVE_KEY>} A Promise that resolves to the move key.
 */
export async function getMoveKey(): Promise<MOVE_KEY> {
  const keyboardMoveType: { [key: string]: MOVE_KEY } = {
    a: MOVE_KEY.Left,
    h: MOVE_KEY.Left,
    left: MOVE_KEY.Left,
    d: MOVE_KEY.Right,
    l: MOVE_KEY.Right,
    right: MOVE_KEY.Right,
    w: MOVE_KEY.Up,
    k: MOVE_KEY.Up,
    up: MOVE_KEY.Up,
    s: MOVE_KEY.Down,
    j: MOVE_KEY.Down,
    down: MOVE_KEY.Down,
  };

  const key = await listenCliKey();
  if (!key) {
    return MOVE_KEY.NoDir;
  }
  return keyboardMoveType[key] || MOVE_KEY.NoDir;
}
