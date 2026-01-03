IMAGE FOLDER STRUCTURE
======================

Add your images to these folders. The site will automatically load them.

FOLDER STRUCTURE:
-----------------

/images/
  /products/      - Product photos (pedals, devices)
                    - fuzilator-main.jpg (main product image)
                    - fuzilator-angle.jpg
                    - fuzilator-guts.jpg
                    - [product-name].jpg

  /workshops/     - Workshop category images
                    - circuit-bending.jpg
                    - diy-synthesis.jpg
                    - creative-destruction.jpg
                    - pedal-building.jpg

  /mods/          - Mod service category images
                    - pedals.jpg
                    - synths.jpg
                    - toys.jpg
                    - misc.jpg

  /gallery/       - Gallery images (any size, will be cropped to square in grid)
                    - [any-name].jpg
                    /thumbs/  - Optional smaller thumbnails (auto-generated if missing)

  /about/         - About page images
                    - profile.jpg (your photo)
                    - workspace.jpg

IMAGE GUIDELINES:
-----------------
- Use JPG or PNG format
- Recommended size: 1200x1200px or larger for products
- Gallery images: any aspect ratio works
- Keep file sizes reasonable (under 500KB ideally)
- Name files descriptively: "fuzilator-side-view.jpg" not "IMG_1234.jpg"

UPDATING CONTENT:
-----------------
After adding images, update the corresponding JSON file in /content/:
- products.json - for product images
- workshops.json - for workshop images
- mods.json - for mod service images
- gallery.json - for gallery images
