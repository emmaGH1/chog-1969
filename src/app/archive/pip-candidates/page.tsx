import type {Metadata} from "next";
import CandidateGallery from "./CandidateGallery";

export const metadata:Metadata={
 title:"Meet the twelve — Pip casting gallery | CHOG / 1969",
 description:"Twelve authentic Chog Genesis originals, verified token IDs, collection traits and fictional personalities. No Pip selected.",
};
export default function PipCandidates(){return <CandidateGallery/>;}
