from itertools import product

from PIL import Image

def is_transparent(data):
    return not any(x for x in data if x[3] != 0)

offsets = []

with Image.open("pokemonicons-sheet.png") as im:
    for upper, left in product(range(0, im.height, 30), range(0, im.width, 40)):
        data = list(im.crop((left, upper, left + 40, upper + 30)).getdata())

        if is_transparent(data):
            offsets.append(0)
            continue

        upper_margin = 0
        while is_transparent(data[upper_margin * 40 : (upper_margin + 1) * 40]):
            upper_margin += 1

        data.reverse()
        lower_margin = 0
        while is_transparent(data[lower_margin * 40 : (lower_margin + 1) * 40]):
            lower_margin += 1

        sprite_height = 30 - lower_margin - upper_margin

        if sprite_height > 19:
            offset = upper_margin + ((sprite_height - 19) // 3)
        else:
            offset = 30 - 19 - lower_margin

        offsets.append(max(offset, 0))

with open("offsets.csv", "w", encoding="utf-8") as f:
    f.writelines([f"{x}\n" for x in offsets])
