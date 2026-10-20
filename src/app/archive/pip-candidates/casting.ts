import sheet from "../../../../public/nft-candidates/provenance.json";

export const groups=[
 {name:"Playful adventure companion",label:"Playful spirits",note:"Quick smiles. Questionable plans."},
 {name:"Mystery / secret-keeper",label:"Secret-keepers",note:"Always one clue ahead."},
 {name:"Dry comic relief",label:"Deadpan comics",note:"An excellent sense of bad timing."},
 {name:"Dangerous-looking ally",label:"Unexpected allies",note:"A frightening first impression."},
];
export const candidates=groups.flatMap(group=>sheet.candidates.filter(candidate=>candidate.archetype===group.name));
export function filterCandidates(query:string,activeGroup="All characters"){
 const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 return candidates.filter(candidate=>{
  const searchable=[candidate.tokenId,candidate.metadata.name,candidate.archetype,candidate.fictionalFit,...candidate.metadata.attributes.map(trait=>`${trait.trait_type} ${trait.value}`)].join(" ").toLowerCase();
  return (activeGroup==="All characters"||activeGroup===candidate.archetype)&&terms.every(term=>searchable.includes(term));
 });
}
