import sharp from 'sharp';

interface ImageProcessingOptions {
  quality?: number;
  width?: number;
  height?: number;
}

export const convertToWebP = async (
  base64Image: string,
  options: ImageProcessingOptions = {}
): Promise<string> => {
  try {
    // Удаляем префикс data:image/...;base64,
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    // Конвертируем base64 в Buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Создаем sharp instance
    let sharpInstance = sharp(imageBuffer);
    
    // Применяем опции, если они указаны
    if (options.width || options.height) {
      sharpInstance = sharpInstance.resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Конвертируем в WebP с указанным качеством
    const webpBuffer = await sharpInstance
      .webp({ quality: options.quality || 80 })
      .toBuffer();
    
    // Конвертируем обратно в base64
    const webpBase64 = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
    
    return webpBase64;
  } catch (error) {
    console.error('Error converting image to WebP:', error);
    throw error;
  }
}; 