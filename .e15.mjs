import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1000, height: 900 } });
const errs=[]; p.on("pageerror",e=>errs.push(String(e)));
for (const r of ["/explorer/prop5","/publier","/apporteurs","/conditions"]) {
  await p.goto("http://localhost:3002"+r,{waitUntil:"domcontentloaded",timeout:60000});
  await p.waitForTimeout(600);
  const t = await p.locator("body").innerText();
  const stale = t.includes("500 CHF") && t.includes("2 500");
  console.log(`${r}: err=${errs.length} vieuxFrais500/2500=${stale}`);
}
console.log("pageerrors:", errs.length ? errs.slice(0,2) : "aucune");
await b.close();
