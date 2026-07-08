import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nishad Beej Bhandar',
    short_name: 'Nishad Seeds',
    description: 'धान, गेहूं, मक्का, सरसों, सब्जियों के बीज, उर्वरक खाद एवं कीटनाशक दवाइयाँ उचित मूल्य पर उपलब्ध हैं।',
    start_url: '/',
    display: 'standalone',
    background_color: '#1b5e20',
    theme_color: '#1b5e20',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
