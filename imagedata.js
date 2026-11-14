async function getColumnsRGB(imageUrl) {
  // 1. Load the PNG image
  const img = new Image();
  img.crossOrigin = "Anonymous"; // Required if loading from an external domain
  img.src = imageUrl;
  await img.decode();

  // 2. Create an off-screen canvas matching the image dimensions
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;

  // 3. Draw the image and extract the raw RGBA byte array
  ctx.drawImage(img, 0, 0);
  const { data, width, height } = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  // 4. Group RGB values by column (x)
  const columns = [];

  for (let x = 0; x < width; x++) {
    const columnPixels = [];

    for (let y = 0; y < height; y++) {
      // Each pixel uses 4 consecutive slots: [R, G, B, A]
      const index = (y * width + x) * 4;

      columnPixels.push({
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
        // Alpha is at data[index + 3] if needed
      });
    }

    columns.push(columnPixels);
  }

  return columns;
}

// Usage example
getColumnsRGB("path/to/your-image.png").then((columns) => {
  console.log("Total columns:", columns.length);
  console.log("All RGB pixels in the first column (x = 0):", columns[0]);
  console.log("Top-left pixel (x = 0, y = 0):", columns[0][0]);
});
