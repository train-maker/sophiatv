#!/usr/bin/env python3
"""Extract the S+globe square from the approved Sophia logo and save as transparent PNGs.
Strategy:
- Source: 1904x826 cartouche with S+globe on left, "Sophia" wordmark on right.
- The S+globe sits inside a square cell on the left, framed by the gold cartouche border.
- Crop a tight square around that cell, then key out the dark background to transparency.
"""
import os, sys
from PIL import Image, ImageFilter

ROOT = "/Users/tarencea.rainey/outputs/sophiatv"
SRC = os.path.join(ROOT, "assets/brand/sophia-logo-approved-2026-04-29.png")

img = Image.open(SRC).convert("RGBA")
W, H = img.size
print(f"source: {W}x{H}")

# 4 candidate crops — we'll save all so we can pick the best one
candidates = [
    (130, 110, 130 + 600, 110 + 600),
    (95, 100, 95 + 640, 100 + 640),
    (165, 130, 165 + 540, 130 + 540),
    (70, 70, 70 + 700, 70 + 700),
]

OUT_DIR = os.path.join(ROOT, "assets/brand")
PREVIEW_DIR = "/tmp/mark-extract"
os.makedirs(PREVIEW_DIR, exist_ok=True)

def key_dark(im, threshold=58):
    """Make near-black pixels transparent. Keep gold pixels opaque.
    threshold = max value across R+G+B for a pixel to be considered 'dark background'."""
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if (r + g + b) // 3 < threshold:
                px[x, y] = (r, g, b, 0)
            elif (r + g + b) // 3 < 100:
                # near-black — soften to partial transparency
                fade = int(((r + g + b) / 3 - threshold) / (100 - threshold) * 255)
                px[x, y] = (r, g, b, max(0, min(255, fade)))
    return im

for i, (l, t, r, b) in enumerate(candidates, start=1):
    if r > W or b > H:
        print(f"skip candidate {i}: out of bounds")
        continue
    crop = img.crop((l, t, r, b))
    keyed = key_dark(crop.copy())
    pv = os.path.join(PREVIEW_DIR, f"mark-candidate-{i}.png")
    keyed.save(pv)
    print(f"saved candidate {i}: {pv}  ({l},{t}) -> ({r},{b})")
