export function loadImageSize(src: string) {
  return new Promise<{ height: number; width: number }>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      resolve({
        height: image.naturalHeight || image.height,
        width: image.naturalWidth || image.width,
      });
    };
    image.onerror = reject;
    image.src = src;
  });
}
