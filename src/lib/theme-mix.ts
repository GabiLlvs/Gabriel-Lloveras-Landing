export const THEME_MIX_KEY = "theme-mix";
export const DARK_BG = "#070b12";
export const LIGHT_BG = "#e8eef7";

export function clampMix(amount: number) {
  if (Number.isNaN(amount)) return 0;
  return Math.min(1, Math.max(0, amount));
}

export function mixHex(from: string, to: string, amount: number) {
  const mix = clampMix(amount);
  const channel = (hex: string, index: number) =>
    Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
  const parts = [0, 1, 2].map((index) =>
    Math.round(channel(from, index) + (channel(to, index) - channel(from, index)) * mix)
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${parts.join("")}`;
}

export const themeScript = `(function(){try{var raw=localStorage.getItem("${THEME_MIX_KEY}");var mix;if(raw!==null&&raw!==""&&!isNaN(parseFloat(raw))){mix=Math.min(1,Math.max(0,parseFloat(raw)));}else{var legacy=localStorage.getItem("theme");if(legacy==="light")mix=1;else if(legacy==="dark")mix=0;else mix=window.matchMedia("(prefers-color-scheme: light)").matches?1:0;}var root=document.documentElement;root.style.setProperty("--mix",String(mix));root.dataset.themeMix=String(mix);root.dataset.theme=mix>=0.5?"light":"dark";function ch(hex,i){return parseInt(hex.slice(1+i*2,3+i*2),16);}function mixHex(a,b,t){var parts=[0,1,2].map(function(i){return Math.round(ch(a,i)+(ch(b,i)-ch(a,i))*t).toString(16).padStart(2,"0");});return "#"+parts.join("");}var color=mixHex("${DARK_BG}","${LIGHT_BG}",mix);document.querySelectorAll('meta[name="theme-color"]').forEach(function(node){node.setAttribute("content",color);});}catch(e){}})();`;
