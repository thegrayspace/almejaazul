import Image, { type ImageProps } from 'next/image';
import { optimizedImageSrc } from '@/lib/image-assets';

type OptimizedImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

export default function OptimizedImage({ src, ...props }: OptimizedImageProps) {
  return <Image src={optimizedImageSrc(src)} {...props} />;
}
