"""Prepare private review crops; never generate or publish character artwork."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
expected = "395fe4d78c74d0a60d3c483509b3daf71d5e7241369a44973ce54101e5a5ee8e"
if hashlib.sha256(source.read_bytes()).hexdigest() != expected:
    raise SystemExit("Not the exact approved Neri reference. No substitute accepted.")
out = root / "public/private-review"
out.mkdir(exist_ok=True)
sheet = Image.open(source).convert("RGBA")
mask = Image.new("L", sheet.size)
# Matte around the existing drawing, not a new pose or illustration.
outline = [(132,1498),(133,1450),(155,1370),(157,1310),(175,1260),(163,1237),
           (193,1192),(113,1222),(42,1165),(70,1010),(22,971),(39,885),(23,866),
           (39,805),(94,660),(135,557),(181,471),(224,390),(268,307),(263,263),
           (286,209),(351,195),(364,183),(350,157),(350,126),(380,95),(407,57),
           (471,44),(507,59),(526,83),(536,123),(532,162),(512,193),(505,221),
           (526,240),(539,275),(546,311),(544,361),(541,399),(559,437),(566,478),
           (579,536),(597,591),(590,679),(613,780),(581,833),(570,966),
           (553,1089),(498,1127),(460,1171),(475,1192),(465,1234),(472,1263),
           (455,1307),(465,1348),(483,1375),(531,1400),(548,1424),(552,1452),
           (491,1466),(348,1440),(348,1412),(365,1370),(373,1327),(358,1300),
           (366,1255),(347,1216),(357,1171),(398,1167),(423,1019),(442,850),
           (447,753),(434,702),(395,794),(357,910),(311,1047),(268,1175),
           (303,1192),(294,1225),(280,1260),(270,1297),(257,1331),(253,1368),
           (268,1413),(272,1446),(261,1490),(205,1502)]
ImageDraw.Draw(mask).polygon(outline, fill=255)
# Remove the reference sheet's cream paper without repainting the drawing.
pixels = sheet.load()
alpha = mask.load()
for y in range(sheet.height):
    for x in range(615):
        r, g, b, _ = pixels[x, y]
        if r > 223 and g > 213 and b > 193:
            alpha[x, y] = 0
sheet.putalpha(mask)
sheet.crop((20,40,615,1510)).save(out / "neri.png")
original = Image.open(source)
original.crop((890,30,1203,239)).save(out / "neri-serious.jpg", quality=95)
original.crop((890,513,1203,718)).save(out / "neri-curious.jpg", quality=95)
packet = json.loads(subprocess.check_output(["git", "show", "origin/feat/nft-memory:public/nft-candidates/provenance.json"], cwd=root))
pip = next(c for c in packet["candidates"] if c["tokenId"] == "1053")
art = subprocess.check_output(["git", "show", "origin/feat/nft-memory:public/nft-candidates/token-1053.webp"], cwd=root)
if hashlib.sha256(art).hexdigest() != pip["artworkSha256"]:
    raise SystemExit("Pip source hash mismatch")
(out / "pip.webp").write_bytes(art)
print("Private approved-reference crops and unchanged CHOG #545 prepared; no files staged.")
