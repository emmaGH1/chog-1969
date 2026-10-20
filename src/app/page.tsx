import Link from "next/link";
export default function Home(){
return <div className="home">
  <div className="stars" aria-hidden="true"></div>
  <section className="hero">
    <div className="eyebrow">AN INTERACTIVE MANGA / MONAD</div>
    <div className="hero-rule" aria-hidden="true">✷</div>
    <h1>THE WORLD<br/><em>FORGOT.</em><br/><span>WE DIDN'T.</span></h1>
    <p className="hero-copy">Two centuries ago, they erased an entire civilization. Now a forbidden drawing is about to remember what happened.</p>
    <div className="hero-actions">
      <Link className="btn btn-primary" href="/chapter/1">enter chapter one <span>↗</span></Link>
      <Link className="btn btn-ghost" href="/archive">inspect the 1,969 seals</Link>
    </div>
    <div className="hero-stamp" aria-hidden="true"><span>01</span><small>THE DRAWING<br/>THAT REMEMBERED</small></div>
  </section>
  <section className="manifesto">
    <span className="eyebrow">FOUND RECORD 001 / CLASSIFIED</span>
    <blockquote>“The ones history called monsters were running toward the catastrophe. Not away from it.”</blockquote>
    <p>The Chogs exist as 1,969 real Genesis NFTs. In this fiction, each is a surviving seal of memory. Their owners decide whether those memories return to the world.</p>
  </section>
</div>;
}
