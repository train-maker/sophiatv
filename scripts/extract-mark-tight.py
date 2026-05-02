#!/usr/bin/env python3
"""Tighter extraction — crop just the S+globe figure, key the dark background to alpha,
and emit transparent PNGs at multiple sizes ready for the site."""
import os, sys
from PIL import Image

ROOT = "/Users/tarencea.rainey/outputs/sophiatv"
SRC = os.path.join(ROOT, "assets/brand/sophia-logo-approved-2026-04-29.png")

img = Image.open(SRC).convert("RGBA")
W, H = img.size  # 1904 x 826

# Tight crop on the S+globe (centered roughly at x≈430, y≈400 in the source).
# Square 380x380 keeps the orbital ring tips but loses the rounded inner frame.
CX, CY, S = 432, 400, 380
half = S // 2
crop = img.crop((CX - half, CY - half, CX + half, CY + half))
print("crop:", crop.size)

# Key out the dark background to transparent. The figure is mostly gold (high R+G).
# Background is near-black. Soft threshold for clean edges.
def key_dark(im, low=46, high=130):
    """Pixels with brightness < low -> alpha 0. brightness in [low, high) -> partial alpha.
    brightness >= high -> alpha 255."""
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            br = (r + g + b) // 3
            if br < low:
                px[x, y] = (r, g, b, 0)
            elif br < high:
                fade = int(((br - low) / (high - low)) * 255)
                px[x, y] = (r, g, b, fade)
            # else keep opaque
    return im

keyed = key_dark(crop)

# Save canonical SVG-replacement at multiple sizes.
sizes = [64, 128, 192, 256, 512, 1024]
for sz in sizes:
    out = keyed.resize((sz, sz), Image.LANCZOS)
    fn = os.path.join(ROOT, f"assets/brand/sophia-mark-{sz}.png")
    out.save(fn)
    print(f"wrote {fn}")

# Save a master at native crop resolution
master = os.path.join(ROOT, "assets/brand/sophia-mark.png")
keyed.save(master)
print(f"wrote {master}")

# Save a preview to /tmp for instant visual check
preview = "/tmp/mark-extract/mark-final.png"
os.makedirs(os.path.dirname(preview), exist_ok=True)
keyed.save(preview)
print(f"preview: {preview}")
