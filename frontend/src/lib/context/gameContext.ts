import { atom } from "recoil";
import createBoard from "../../game/createBoard";

const dimension = {
  row: 15,
  col: 15,
};
const dimensionAtom = atom({
  key: "dimension",
  default: dimension,
});
const bombsLeft = Math.ceil((dimension.row * dimension.col) / 10);
const bombsAtom = atom<number>({
  key: "bombs",
  default: bombsLeft,
});

const gameStatusAtom = atom<string>({
  key: "gameStatus",
  default: "",
});

const gridAtom = atom<any[]>({
  key: "grid",
  default: createBoard(dimension.row, dimension.col, bombsLeft),
});

export { bombsAtom, gameStatusAtom, gridAtom, dimensionAtom };
