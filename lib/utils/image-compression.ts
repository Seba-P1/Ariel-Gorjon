/**
 * Client-side image compression using HTML Canvas
 * Resizes max dimension to maxWidth/maxHeight and outputs JPEG/WebP blob
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    type?: string;
  } = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    type = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let { width, height } = img;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo inicializar el contexto de imagen'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Fallo en la compresión del canvas'));
            }
          },
          type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo de imagen'));
    };
  });
}
