import { DarkmodeSwitch } from "./DarkmodeSwitch";
import logo from "../public/mine/android-chrome-512x512.png";

const Topbar = () => {
  return (
    <div className="glass  mb-4 flex flex-row justify-between rounded-lg border border-slate-300 p-4 dark:border-slate-500">
      <img src={logo} className="w-12 hover:animate-ping" alt="logo" />
      <p className="font-head text-4xl">Minesweeper</p>
      <DarkmodeSwitch />
    </div>
  );
};

export default Topbar;
