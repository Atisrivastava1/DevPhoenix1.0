from PIL import Image

img = Image.open('public/learning.png')
img = img.convert("RGBA")
pixels = img.load()

width, height = img.size
# Check the 4 corners
corners = [
    pixels[0, 0],
    pixels[width-1, 0],
    pixels[0, height-1],
    pixels[width-1, height-1]
]

print("Corner pixels (R, G, B, A):")
for p in corners:
    print(p)
