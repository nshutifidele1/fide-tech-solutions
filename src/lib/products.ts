import type { Product, Review } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string, fallbackId: string = 'computer-1') => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  // Return a fallback image if the requested one isn't found
  return image || PlaceHolderImages.find((img) => img.id === fallbackId) || PlaceHolderImages[0];
};

export const products: Product[] = [
  {
    id: '1',
    slug: 'quantum-core-i9-gaming-desktop',
    name: 'QuantumCore i9 Gaming Desktop',
    description:
      'Unleash gaming nirvana with the QuantumCore i9. Featuring the latest Intel processor and NVIDIA graphics, this rig is built to dominate the most demanding titles. Experience fluid gameplay and breathtaking visuals.',
    category: 'Computers',
    brand: 'Quantum',
    price: 2499.99,
    stock: 15,
    rating: 4.8,
    reviewsCount: 124,
    specifications: {
      CPU: 'Intel Core i9-13900K',
      GPU: 'NVIDIA GeForce RTX 4080',
      RAM: '32GB DDR5 6000MHz',
      Storage: '2TB NVMe SSD',
      OS: 'Windows 11 Pro',
    },
    features: ['Liquid Cooling System', 'Customizable RGB Lighting', 'Tool-less Chassis Design', 'VR Ready'],
    image: findImage('computer-1'),
    gallery: [findImage('computer-1-gallery-1'), findImage('computer-1-gallery-2'), findImage('computer-1-gallery-3')],
  },
  {
    id: '2',
    slug: 'nova-mesh-wifi-6e-router',
    name: 'NovaMesh WiFi 6E Router',
    description:
      'Blanket your home in blazing-fast, next-generation WiFi with the NovaMesh Router. The new 6 GHz band offers interference-free speed for all your 8K streaming, online gaming, and video conferencing needs.',
    category: 'Routers',
    brand: 'NovaNet',
    price: 349.99,
    stock: 45,
    rating: 4.9,
    reviewsCount: 210,
    specifications: {
      'Wi-Fi Standard': 'Wi-Fi 6E (802.11ax)',
      Bands: 'Tri-Band (2.4 GHz, 5 GHz, 6 GHz)',
      Speed: 'Up to 11 Gbps',
      Coverage: 'Up to 3,000 sq ft',
      Ports: '1x 2.5G WAN, 4x 1G LAN',
    },
    features: ['AI-Powered Mesh', 'WPA3 Security', 'Easy App-based Setup', 'Parental Controls'],
    image: findImage('router-1'),
    gallery: [findImage('router-1-gallery-1'), findImage('router-1-gallery-2'), findImage('router-1-gallery-3')],
  },
  {
    id: '3',
    slug: 'synapse-24-port-gigabit-switch',
    name: 'Synapse 24-Port Gigabit Switch',
    description:
      'Expand your network with the reliable and high-performance Synapse 24-Port Switch. Ideal for small to medium businesses, this unmanaged switch provides simple, plug-and-play connectivity for all your wired devices.',
    category: 'Switches',
    brand: 'Synapse',
    price: 199.99,
    stock: 30,
    rating: 4.7,
    reviewsCount: 88,
    specifications: {
      Ports: '24 x 10/100/1000 Mbps',
      'Switching Capacity': '48 Gbps',
      'Forwarding Rate': '35.7 Mpps',
      Type: 'Unmanaged',
      Housing: 'Metal, Rack-mountable',
    },
    features: ['Energy-Efficient Ethernet', 'Fanless Silent Operation', 'Plug and Play', 'Quality of Service (QoS)'],
    image: findImage('switch-1'),
    gallery: [findImage('switch-1-gallery-1'), findImage('switch-1-gallery-2'), findImage('switch-1-gallery-3')],
  },
  {
    id: '4',
    slug: 'aero-book-pro-14-inch',
    name: 'AeroBook Pro 14-inch',
    description:
      'Productivity meets portability in the AeroBook Pro. With its stunning Liquid Retina XDR display and powerful M3 chip, it delivers exceptional performance for creative professionals on the go. All-day battery life keeps you unplugged.',
    category: 'Computers',
    brand: 'Aero',
    price: 1999.0,
    stock: 25,
    rating: 4.9,
    reviewsCount: 150,
    specifications: {
      CPU: 'Aero M3 Pro Chip',
      Display: '14.2-inch Liquid Retina XDR',
      RAM: '18GB Unified Memory',
      Storage: '512GB SSD',
      Battery: 'Up to 18 hours',
    },
    features: ['Backlit Magic Keyboard', 'Touch ID', '1080p FaceTime HD Camera', 'Thunderbolt 4 Ports'],
    image: findImage('laptop-1'),
    gallery: [findImage('laptop-1-gallery-1'), findImage('laptop-1-gallery-2'), findImage('laptop-1-gallery-3')],
  },
  {
    id: '5',
    slug: 'connect-all-usb-c-hub',
    name: 'ConnectAll USB-C Hub',
    description:
      'The ultimate companion for your modern laptop. The ConnectAll USB-C Hub expands a single port into a versatile array of connections, including HDMI, USB-A, SD card readers, and pass-through charging.',
    category: 'Gadgets',
    brand: 'ConnectAll',
    price: 59.99,
    stock: 150,
    rating: 4.6,
    reviewsCount: 350,
    specifications: {
      'Host Interface': 'USB-C',
      Ports: '1x HDMI 4K@60Hz, 2x USB-A 3.1, 1x SD Card, 1x MicroSD, 1x USB-C PD (100W)',
      Material: 'Aluminum Alloy',
      Compatibility: 'MacBook, Windows, Chromebook',
    },
    features: ['4K 60Hz Video Output', '100W Power Delivery', 'High-Speed Data Transfer', 'Compact & Portable'],
    image: findImage('gadget-1'),
    gallery: [findImage('gadget-1-gallery-1'), findImage('gadget-1-gallery-2'), findImage('gadget-1-gallery-3')],
  },
  {
    id: '6',
    slug: 'guardian-nas-4-bay',
    name: 'Guardian NAS 4-Bay',
    description:
      'Safeguard your digital life with the Guardian NAS. This 4-bay network-attached storage device is your personal cloud, perfect for backing up computers, sharing files, and streaming media across your home network.',
    category: 'Networking',
    brand: 'Guardian',
    price: 499.99,
    stock: 20,
    rating: 4.8,
    reviewsCount: 95,
    specifications: {
      Bays: '4 x 3.5"/2.5" SATA HDD/SSD',
      CPU: 'Quad-Core 1.5 GHz',
      RAM: '2 GB DDR4 (expandable)',
      Ports: '2 x 1GbE LAN, 2 x USB 3.0',
    },
    features: ['Centralized Data Storage', 'Remote Access', 'Media Server (Plex/Emby)', 'Advanced RAID options'],
    image: findImage('networking-1'),
    gallery: [findImage('networking-1-gallery-1'), findImage('networking-1-gallery-2'), findImage('networking-1-gallery-3')],
  },
];

export const productReviews: { [productId: string]: Review[] } = {
  '1': [
    {
      id: 'rev1',
      author: 'GamerGod1',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      rating: 5,
      title: 'Absolute Beast!',
      comment: 'This PC handles everything I throw at it without breaking a sweat. Cyberpunk 2077 on max settings is a dream. The RGB lighting is a nice touch too!',
      date: '2024-06-15',
    },
    {
      id: 'rev2',
      author: 'VideoEditorPro',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
      rating: 5,
      title: 'Renders 4K video like a hot knife through butter.',
      comment: 'My render times have been cut in half. The 2TB NVMe is incredibly fast for project files. Worth every penny for professional work.',
      date: '2024-06-10',
    },
  ],
  '2': [
    {
      id: 'rev3',
      author: 'TechieTina',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
      rating: 5,
      title: 'Finally, no more buffering!',
      comment: "My apartment building is crowded with WiFi signals. The 6GHz band on this router is a game-changer. I'm getting my full internet speed everywhere in my home.",
      date: '2024-07-01',
    },
  ],
  '4': [
    {
      id: 'rev4',
      author: 'CreativeCloud',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
      rating: 5,
      title: 'The perfect mobile workstation',
      comment: "I can edit photos and short videos on the go without being chained to a power outlet. The display is absolutely gorgeous and color-accurate.",
      date: '2024-06-20',
    },
     {
      id: 'rev5',
      author: 'DevDude',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
      rating: 4,
      title: 'Powerful, but gets warm',
      comment: "It's a fantastic machine for coding, but it can get a bit warm on the lap when I'm running multiple containers. Performance is undeniable though. Keyboard is a joy to type on.",
      date: '2024-06-18',
    },
  ],
};

// getProducts is now deprecated and will be removed.
// Data should be fetched from Firestore.
export const getProducts = (): Product[] => products;
export const getProductBySlug = (slug: string): Product | undefined => products.find((p) => p.slug === slug);
export const getFeaturedProducts = (): Product[] => products.slice(0, 4);
export const getReviewsForProduct = (productId: string): Review[] => productReviews[productId] || [];
