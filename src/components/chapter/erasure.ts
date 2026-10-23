export const testimony = [
  ["WE", "WERE", "NOT", "THE", "CAUSE."],
  ["WE", "WERE", "TRYING", "TO", "CLOSE", "THE", "DOOR."],
  ["HER", "BROTHER", "WAS", "THERE."],
];

const targets = ["CAUSE.", "BROTHER", "CLOSE", "DOOR."];

export function erasureStage(remaining:number,timed:boolean){
  return timed?Math.max(0,Math.min(targets.length,Math.floor((40-remaining)/8))):0;
}

export function isWordErased(word:string,stage:number,route:"keep"|"burn"|null){
  if(route)return route==="burn";
  return targets.slice(0,stage).includes(word);
}
