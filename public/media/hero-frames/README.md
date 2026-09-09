# Hero scroll frame sequence

Drop the exported frames in this folder, then flip the switch. Until you do, the
hero uses the single static image (`../hero.jpg`) — nothing changes.

## 1. Produce the frames

- Export **90–130 frames** of the drive shot (a 3–4 s clip at 30 fps, or a 3D
  render). More frames = smoother scrub, heavier download.
- Resize to **≤ 1600 px wide** (the hero is a background; more resolution is
  wasted bandwidth).
- Encode as **WebP**, quality ~72, targeting **15–35 KB per frame**
  (~2–4 MB for 120 frames total).
- Name them zero-padded, 1-based: `frame_0001.webp`, `frame_0002.webp`, …

Example with `ffmpeg` + `cwebp`:

```bash
ffmpeg -i drive.mp4 -vf "fps=30,scale=1600:-2" frames_src/%04d.png
for f in frames_src/*.png; do
  cwebp -q 72 "$f" -o "public/media/hero-frames/frame_$(basename "${f%.png}").webp"
done
```

## 2. Turn it on

In `lib/hero-frames.ts` set:

```ts
export const HERO_FRAME_COUNT = 120; // <- your actual frame count
```

That's it. On desktop with motion allowed, the hero now pins for
`HERO_FRAME_PIN_VH` viewport-heights (default 1.8) and scrubs the frames with
scroll. The static image shows as a poster with a "Loading %" readout until
every frame decodes.

## 3. Mobile & reduced motion

`HeroMedia` only mounts the sequence when `desktop && !reduced`. Phones and
anyone with "reduce motion" on keep the static poster — do **not** ship 120
frames to mobile.

## 4. Tuning

- Scrub feel / pin length: `HERO_FRAME_PIN_VH` in `lib/hero-frames.ts`.
- Cover-fit and the ink/ember wash: `components/home/hero-frame-sequence.tsx`.
