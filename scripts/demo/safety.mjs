export function privateBase(input='http://127.0.0.1:3103') {
  const url=new URL(input);
  if(url.protocol!=='http:' || !['127.0.0.1','localhost','[::1]'].includes(url.hostname) || url.username || url.password || url.pathname!=='/' || url.search || url.hash)throw new Error('Demo capture requires a plain HTTP loopback origin, never a public deployment.');
  return url.origin;
}
export function requireReadOnly(config) {
  if(!config || config.enabled!==false)throw new Error('Capture refused: live writes must be explicitly disabled.');
}
export function requirePreflight(report,{head,buildId,now=Date.now()}) {
  if(report?.status!=='passed' || report.head!==head || report.buildId!==buildId || !Array.isArray(report.checks) || report.checks.length!==5 || report.checks.some(c=>c.exitCode!==0))throw new Error('Capture requires a passing preflight for this exact commit and production build.');
  const age=now-Date.parse(report.finishedAt);
  if(!Number.isFinite(age) || age<0 || age>24*60*60*1000)throw new Error('Preflight is stale; rerun it within 24 hours of capture.');
}
export function requireVisualApproval(approval,{head,tokenId}) {
  for(const key of ['approvedBy','approvedAt','evidence','heroArtReference'])if(typeof approval?.[key]!=='string' || !approval[key].trim())throw new Error('Final recording requires documented human companion/hero visual approval.');
  if(approval.sourceCommit!==head || approval.companionTokenId!==tokenId || approval.visualsApproved!==true || !Number.isFinite(Date.parse(approval.approvedAt)) || Date.parse(approval.approvedAt)>Date.now())throw new Error('Visual approval must match this commit and the actual Genesis companion token.');
}
export function sourceChanges(status) {
  // Next regenerates this declaration during every production build; no runtime code lives here.
  return status.split('\n').filter(line=>line.trim() && line.slice(3)!=='next-env.d.ts');
}
