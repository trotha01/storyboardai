export async function postProcessImage(dataUrl: string): Promise<string> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const r = imgData.data[i];
    const g = imgData.data[i + 1];
    const b = imgData.data[i + 2];
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;
    imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = gray;
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}
