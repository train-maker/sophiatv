#!/usr/bin/env python3
"""Replace the static <img class='landing-unity-image'> in index.html with a <video> element.
Idempotent — safe to run twice."""
import re, sys, os

ROOT = "/Users/tarencea.rainey/outputs/sophiatv"
INDEX = os.path.join(ROOT, "index.html")

with open(INDEX, "r", encoding="utf-8") as f:
    html = f.read()

NEW_BLOCK = '''<video
            class="landing-unity-image landing-unity-video"
            autoplay
            loop
            muted
            playsinline
            preload="metadata"
            poster="assets/brand/sophia-unity-hands-poster.jpg"
            width="1920"
            height="1080"
            aria-label="Hands from around the world joined together in unity"
          >
            <source src="assets/video/sophia-unity-hands.mp4" type="video/mp4" />
            <img
              src="assets/brand/sophia-world-unity-hands-1200.jpg"
              alt="Hands from around the world joined together in unity"
              class="landing-unity-image"
              width="1200"
              height="515"
              loading="eager"
              decoding="async"
            />
          </video>'''

# Match the existing <img class="landing-unity-image" ... /> block
pattern = re.compile(
    r'<img\s+src="assets/brand/sophia-world-unity-hands-1200\.jpg"[^>]*?class="landing-unity-image"[^/]*?/>',
    re.DOTALL,
)

if "landing-unity-video" in html:
    print("already swapped, no-op")
    sys.exit(0)

if not pattern.search(html):
    # Try a more flexible match that allows attribute reordering
    pattern2 = re.compile(
        r'<img[^>]*sophia-world-unity-hands-1200\.jpg[^>]*?/>',
        re.DOTALL,
    )
    if not pattern2.search(html):
        print("ERROR: could not find hero img to replace", file=sys.stderr)
        sys.exit(1)
    html2 = pattern2.sub(NEW_BLOCK, html, count=1)
else:
    html2 = pattern.sub(NEW_BLOCK, html, count=1)

# Add a tiny CSS rule so <video> sizes the same as <img> at this slot.
EXTRA_CSS = "\n.landing-unity-video { display: block; width: 100%; height: 100%; object-fit: cover; }\n"
if "landing-unity-video {" not in html2:
    # Insert before </style> closest to the head, or before </head> if no <style>
    style_close = html2.find("</style>")
    if style_close > -1:
        html2 = html2[:style_close] + EXTRA_CSS + html2[style_close:]

with open(INDEX, "w", encoding="utf-8") as f:
    f.write(html2)

print("OK swapped img -> video at landing-unity-banner")
