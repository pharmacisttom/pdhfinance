import os
from PIL import Image, ImageFilter
import numpy as np
from collections import deque

input_path = "public/img/pdh.png"
backup_path = "public/img/pdh.original.png"

im = Image.open(input_path).convert("RGBA")
w, h = im.size
arr = np.array(im)

# Save backup if not already saved
if not os.path.exists(backup_path):
    im.save(backup_path)
    print("Saved backup to:", backup_path)

# Flood fill outer white pixels from borders
visited = np.zeros((h, w), dtype=bool)
q = deque()

# Add all border pixels that are near white
for x in range(w):
    for y in [0, 1, h-2, h-1]:
        r, g, b, _ = arr[y, x]
        if r > 235 and g > 235 and b > 235 and not visited[y, x]:
            visited[y, x] = True
            q.append((y, x))

for y in range(h):
    for x in [0, 1, w-2, w-1]:
        r, g, b, _ = arr[y, x]
        if r > 235 and g > 235 and b > 235 and not visited[y, x]:
            visited[y, x] = True
            q.append((y, x))

while q:
    y, x = q.popleft()
    for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
            r, g, b, _ = arr[ny, nx]
            # Outer white background threshold
            if r > 238 and g > 238 and b > 238:
                visited[ny, nx] = True
                q.append((ny, nx))

outer_count = np.sum(visited)
print(f"Outer white background pixels found: {outer_count} ({outer_count / (w * h) * 100:.2f}%)")

# Create clean alpha mask
# Inner emblem = 255, Outer background = 0
mask = np.ones((h, w), dtype=np.uint8) * 255
mask[visited] = 0

# Apply subtle antialiasing Gaussian blur (0.6 radius) to the mask edges
mask_im = Image.fromarray(mask, mode="L").filter(ImageFilter.GaussianBlur(radius=0.6))

# Apply alpha channel
im.putalpha(mask_im)

# Save to public/img/pdh.png and public/pdh.png
im.save("public/img/pdh.png", format="PNG", optimize=True)
if os.path.exists("public/pdh.png"):
    im.save("public/pdh.png", format="PNG", optimize=True)

print("Successfully created transparent pdh.png with smooth antialiased edges!")
