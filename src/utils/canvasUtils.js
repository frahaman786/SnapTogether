// Small, framework-agnostic canvas helpers used by the photobooth capture pipeline.

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

// Draws `img` into the target rect, cropping (rather than stretching) to cover it.
export function drawCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sx, sy, sw, sh;
  if (imgRatio > targetRatio) {
    sh = img.height;
    sw = sh * targetRatio;
    sy = 0;
    sx = (img.width - sw) / 2;
  } else {
    sw = img.width;
    sh = sw / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// Draws a <video> frame into half of the capture canvas (used for the two-person split).
export function drawVideoCover(ctx, video, x, y, w, h, mirror) {
  if (!video || !video.videoWidth) {
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y, w, h);
    return;
  }
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const videoRatio = vw / vh;
  const targetRatio = w / h;
  let sx, sy, sw, sh;
  if (videoRatio > targetRatio) {
    sh = vh;
    sw = sh * targetRatio;
    sy = 0;
    sx = (vw - sw) / 2;
  } else {
    sw = vw;
    sh = sw / targetRatio;
    sx = 0;
    sy = (vh - sh) / 2;
  }
  ctx.save();
  if (mirror) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
  } else {
    ctx.drawImage(video, sx, sy, sw, sh, x, y, w, h);
  }
  ctx.restore();
}

export function textColorFor(background) {
  return background === '#241726' ? '#fff8ef' : '#241726';
}

export function drawCaptionFooter(ctx, width, y, ink, caption, dateStr) {
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = "600 30px 'DM Sans', sans-serif";
  ctx.fillText(caption, width / 2, y + 34);
  ctx.font = "12px 'Space Mono', monospace";
  ctx.globalAlpha = 0.6;
  ctx.fillText('SnapTogether · ' + dateStr.toUpperCase(), width / 2, y + 58);
  ctx.globalAlpha = 1;
}

// Efficiently triggers a browser download from a canvas using toBlob
// (much lighter than base64-encoding a data URL for large images).
export function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, 'image/png');
}
