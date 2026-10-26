# New town checklist (e.g. Hyannis)
1. Copy `towns/falmouth/town.json` → `towns/hyannis/town.json`; edit name/categories.
2. Build print maps (welltown-town-kit skill): illustrated sides, 20 border ad slots, 4 corner QRs.
3. Export map JPGs to `assets/maps/<slug>-*.jpg`.
4. Copy `falmouth/` → `hyannis/`; replace directory lists with verified businesses (name, address, phone, site).
5. Point QR codes at `/<slug>/directory/<category>/`.
6. Seed magazine, pets, sports, news, visionaries, artist corner, VR, VR shops — real data only.
7. Flip Hyannis card on `/index.html` from SOON to LIVE; push; check curl 200.
