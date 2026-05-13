FOOD PHOTOS
===========

The menu cards in index.html each have a SLOT for a food photo.
The site is currently wired to use the photos in:

    images/Whos doing it like this/

Specifically:
  - Oxtails      -> IMG_1518.PNG     (clean shot of ribs/oxtails)
  - Turkey Chops -> CSS placeholder  (no clean photo yet)
  - Chicken      -> CSS placeholder  (no clean photo yet)
  - Mac n Cheese -> CSS placeholder  (see note below about desert.webp)
  - Greens       -> CSS placeholder  (no clean photo yet)
  - Rice         -> CSS placeholder  (no clean photo yet)

NOTE on desert.webp
-------------------
The file `desert.webp` in your folder is actually a HEIF/HEIC image
that has been renamed with a .webp extension. Browsers can't display
it. To use it, open it in Preview/Photos and re-save as a real .jpg
or .png, then drop it here.

To fully wire the menu, drop new files into THIS folder named exactly:
  - oxtails.jpg
  - turkey-chops.jpg
  - chicken.jpg
  - mac-n-cheese.jpg
  - greens.jpg
  - rice.jpg

Then in index.html, search for "FOOD-IMG" comments above each card and
swap the src= for the new path: images/food/oxtails.jpg, etc.

NOTE on .HEIC files
-------------------
The food.HEIC and food2.HEIC files in your folder won't display in
browsers. To use them, convert them to .jpg first:
  - On iPhone: Settings > Camera > Formats > Most Compatible (then re-export)
  - On Mac:    Open in Preview, File > Export, choose JPEG
  - Online:    https://heictojpg.com (free)
