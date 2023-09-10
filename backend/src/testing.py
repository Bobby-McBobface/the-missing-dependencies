from PIL import Image
import numpy as np
with Image.open(r'D:\PythondiscordCodejam\the-missing-dependencies\backend\tests\imgs\piet_hello3.png') as image: 
        palette = np.array(image.getpalette(), np.uint8).reshape((256, 3))
        w, h = image.size
        image_arr = np.zeros((h,w,3), np.uint8)
        for x in range(len(image_arr)):
            for y in range(len(image_arr[0])):
                image_arr[x][y] = palette[image.getpixel((y,x))]
        im = Image.fromarray(image_arr)
        new_im = Image.new('RGB', (24, 24), (0, 0, 0))
        new_im.paste(im, (0, 0))
        new_im.show()
        new_im.save(r'D:\PythondiscordCodejam\the-missing-dependencies\backend\user_files\piet_hello4.png')