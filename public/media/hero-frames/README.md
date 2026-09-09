# Hero scroll frame sequence

**Currently active.** 96 WebP frames (`frame_0001.webp` … `frame_0096.webp`) extracted
from `_source-media/Truck_driving_on_highway_1080p_*.mp4` — a 4s, 24fps, 1920×1080 clip —
scaled to 1600px wide, ~25 KB/frame, ~2.4 MB total.

## How it behaves

On desktop with motion allowed, `HeroFrameSequence` draws the frames to a `<canvas>` and
scrubs frame 0 → 95 as the hero scrolls from full-screen to fully past. **No pin** — it
never fights the pinned sections below it. Mobile and `prefers-reduced-motion` keep the
static poster (`../hero.jpg`); the sequence isn't even mounted.

## Regenerating from a new clip

```bash
# 1. extract every frame, resized
ffmpeg -v error -i _source-media/<clip>.mp4 -vf "scale=1600:-2" _frames_tmp/%04d.png

# 2. PNG -> WebP, renamed frame_0001.webp …
node -e "const s=require('sharp'),fs=require('fs');const f=fs.readdirSync('_frames_tmp').filter(x=>x.endsWith('.png')).sort();(async()=>{for(let i=0;i<f.length;i++)await s('_frames_tmp/'+f[i]).webp({quality:72,effort:4}).toFile('public/media/hero-frames/frame_'+String(i+1).padStart(4,'0')+'.webp');console.log(f.length+' frames')})()"

rm -rf _frames_tmp
```

Then set `HERO_FRAME_COUNT` in `lib/hero-frames.ts` to the new count.

## Guidelines for the source clip

- 3–5 seconds, ≥ 24 fps → 70–150 frames. Fewer = choppier scrub, more = heavier download.
- Locked or truck-tracking camera, steady exposure and colour across the whole clip
  (frames are shown individually — an exposure jump reads as a flash).
- Overcast / desaturated works best; the ink + ember wash is applied in
  `components/home/hero-frame-sequence.tsx`.
- Don't exceed ~1600px wide or ~3 MB total.

## Turning it off

Set `HERO_FRAME_COUNT = 0` in `lib/hero-frames.ts` — the hero reverts to the static image.
