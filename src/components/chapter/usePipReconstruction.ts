"use client";
import {useEffect,useState} from "react";
import {parseReconstruction,RECONSTRUCTION_KEY,type Reconstruction} from "./pip-reconstruction";

let sessionReceipt:Reconstruction|null=null;
export function usePipReconstruction() {
  const [receipt,setReceipt]=useState<Reconstruction|null>(null);
  const [ready,setReady]=useState(false);
  const [storageError,setStorageError]=useState(false);
  useEffect(()=>{
    function restore() {
      try {sessionReceipt=parseReconstruction(localStorage.getItem(RECONSTRUCTION_KEY));setStorageError(false);}
      catch {setStorageError(true);}
      setReceipt(sessionReceipt);setReady(true);
    }
    restore();
    function changed(event:StorageEvent){if(event.key===RECONSTRUCTION_KEY || event.key===null)restore();}
    window.addEventListener("storage",changed);
    return ()=>window.removeEventListener("storage",changed);
  },[]);
  function complete(value:Reconstruction) {
    sessionReceipt=value;setReceipt(value);
    try {localStorage.setItem(RECONSTRUCTION_KEY,JSON.stringify(value));setStorageError(false);}
    catch {setStorageError(true);}
  }
  function reset() {
    sessionReceipt=null;setReceipt(null);
    try {localStorage.removeItem(RECONSTRUCTION_KEY);setStorageError(false);}
    catch {setStorageError(true);}
  }
  return {receipt,ready,storageError,complete,reset};
}
