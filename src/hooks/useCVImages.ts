
import { useState } from 'react';

export const useCVImages = () => {
  const [images, setImages] = useState<{ [key: string]: string }>({});

  const uploadImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const imageId = `img_${Date.now()}`;
        setImages(prev => ({ ...prev, [imageId]: result }));
        resolve(result);
      };
      reader.readAsDataURL(file);
    });
  };

  const getImageUrl = (imageId: string): string | undefined => {
    return images[imageId];
  };

  return {
    images,
    uploadImage,
    getImageUrl
  };
};
