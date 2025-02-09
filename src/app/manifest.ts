import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Science Parking - META-INF',
    short_name: 'Parking',
    description: 'META-INF Science Parking for Science Park Office',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
  };
}
