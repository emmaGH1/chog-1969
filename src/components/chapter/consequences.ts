import type {EscapeRoute} from "./progress";

export function consequence(route:EscapeRoute){
  if(!route)return null;
  return route==="keep"?{
    evidence:"Complete testimony",notice:"IDENTIFIED / NERI + CHOG 545",
    memory:"we ran toward the sea, not away from it. we were trying to close the door. your brother held it open for the last of us. platform 19. tide 69.",
    inscription:"Platform 19. Tide 69. He left you a way into the city they erased.",
    aftermath:"Sera pins a surveillance print to the wall. Neri and Pip are circled in ink. You kept the witness account. Now the Accord knows who carries it.",
    lead:"The harbor coordinates survived. The route to the missing city is known—but watched.",
  }:{
    evidence:"Testimony incomplete",notice:"UNIDENTIFIED / ARCHIVE BREACH",
    memory:"we ran toward the sea, not away from it. we were trying to close the door. [THE NEXT VOICE AND COORDINATES WERE LOST WITH THE RECORD.]",
    inscription:"Find the city they erased. The coordinates were in the record you burned.",
    aftermath:"Sera pins a blank identification sheet to the wall. Smoke hid your faces. The Accord is searching the harbor, but it does not know whom to follow.",
    lead:"Your faces remain unknown. Without the coordinates, another witness must show you the way.",
  };
}
