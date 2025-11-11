import { Product, ProductCategory } from '@/types';

const categories: ProductCategory[] = [
  'Electronics',
  'Clothing',
  'Furniture',
];

const brands = {
  Electronics: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP'],
  Clothing: ['Fox', 'Renuar', 'Nike', 'Adidas', 'Zara', 'H&M', 'Castro'],
  Furniture: ['Ikea', 'Home Center', 'beitily'],
};

const productNames: Record<ProductCategory, string[]> = {
  Electronics: [
    'Headphones',
    'Smart Watch',
    'Television',
    'Laptop',
    'Speakers',
    'Tablet',
    'Camera',
    'Smartphone',
  ],
  Clothing: [
    'T-Shirt',
    'Jeans',
    'Shoes',
    'Jacket',
    'Sneakers',
    'Dress',
    'Sweatshirt',
    'Pants',
    'Coat',
    'Shorts',
  ],
  Furniture: [
    'Cauch Sofa',
    'Coffee Table',
    'Bookshelf',
    'Dining Table Set',
    'Recliner Chair',
    'Vacuum Cleaner',
    'Standing Desk',
    'Office Chair',
    'Table Lamp',
  ],
};

const descriptions = [
  'Premium quality with exceptional durability and performance.',
  'Expertly crafted for everyday use and long-lasting satisfaction.',
  'Innovative design meets functionality in this outstanding product.',
  'Experience superior quality and comfort with this exceptional item.',
  'Built to last with attention to every detail and finish.',
  'Modern technology combined with timeless design principles.',
  'Perfect for both beginners and experienced users alike.',
  'Trusted by professionals and enthusiasts around the world.',
  'Designed to exceed expectations and deliver outstanding results.',
  'A must-have addition to your collection that won\'t disappoint.',
];

function generateImageUrl(seed: string): string {
  const imageIds = [
    'photo-1505740420928-5e560c06d30e',
    'photo-1523275335684-37898b6baf30',
    'photo-1572635196237-14b3f281503f',
    'photo-1560343090-f0409e92791a',
    'photo-1542291026-7eec264c27ff',
    'photo-1503602642458-232111445657',
    'photo-1491553895911-0055eca6402d',
    'photo-1606813907291-d86efa9b94db',
    'photo-1585386959984-a4155224a1ad',
    'photo-1525966222134-fcfa99b8ae77',
  ];
  
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = imageIds[hash % imageIds.length];
  
  return `https://images.unsplash.com/${imageId}?w=800&q=80`;
}

export function generateMockProducts(count: number = 1000): Product[] {
  const products: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const brandList = brands[category];
    const nameList = productNames[category];
    
    const name = nameList[i % nameList.length];
    const brand = brandList[i % brandList.length];
    const description = descriptions[i % descriptions.length];
    
    const product: Product = {
      id: `prod-${String(i + 1).padStart(4, '0')}`,
      name: `${name} - ${brand}`,
      description,
      price: Math.round((Math.random() * 990 + 10) * 100) / 100,
      category,
      image: generateImageUrl(`${category}-${i}`),
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 500) + 10,
      stock: Math.floor(Math.random() * 100) + 1,
      brand,
      tags: [category, brand.toLowerCase(), name.toLowerCase().split(' ')[0]],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    products.push(product);
  }
  
  return products;
}

export const mockProducts = generateMockProducts(1000);
