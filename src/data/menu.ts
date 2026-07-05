export type MenuItem = {
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  popular?: boolean;
};

export type MenuCategory = {
  id: string;
  label: string;
  blurb: string;
  items: MenuItem[];
};

const px = (id: number, w = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const menu: MenuCategory[] = [
  {
    id: 'starters',
    label: 'Starters',
    blurb: 'Crispy, smoky, and aromatic bites to awaken your palate.',
    items: [
      {
        name: 'Vegetable Samosa',
        description: 'Flaky golden pastry stuffed with spiced potato and peas, served with tamarind chutney.',
        price: 120,
        image: px(37153389),
        tags: ['Veg', 'Fried'],
        popular: true,
      },
      {
        name: 'Paneer Tikka',
        description: 'Char-grilled cottage cheese marinated in yogurt, ginger-garlic, and Kashmiri spices.',
        price: 280,
        image: px(23286188),
        tags: ['Veg', 'Tandoor'],
      },
      {
        name: 'Samosa Chaat',
        description: 'Crushed samosa topped with chickpeas, mint, sweet yogurt, and pomegranate.',
        price: 160,
        image: px(29037265),
        tags: ['Veg', 'Street'],
      },
    ],
  },
  {
    id: 'main-course',
    label: 'Main Course',
    blurb: 'Slow-cooked curries, fragrant biryanis, and tandoor breads — the heart of the table.',
    items: [
      {
        name: 'Hyderabadi Dum Biryani',
        description: 'Basmati rice layered with marinated chicken, saffron, and fried onions, sealed and slow-cooked.',
        price: 420,
        image: px(12737656),
        tags: ['Chef Special'],
        popular: true,
      },
      {
        name: 'Butter Chicken',
        description: 'Tandoor chicken simmered in a velvety tomato gravy with butter, cream, and fenugreek.',
        price: 380,
        image: px(9609835),
        tags: ['Mild'],
      },
      {
        name: 'Dal Makhani',
        description: 'Black lentils slow-cooked overnight with butter and cream for a rich, smoky finish.',
        price: 260,
        image: px(28674561),
        tags: ['Veg', 'Slow-cooked'],
      },
      {
        name: 'Palak Paneer',
        description: 'Cottage cheese cubes in a silky spinach gravy tempered with cumin and garlic.',
        price: 300,
        image: px(9609840),
        tags: ['Veg'],
      },
      {
        name: 'Egg Biryani',
        description: 'Fragrant basmati with spiced boiled eggs, mint, and caramelized onions.',
        price: 320,
        image: px(31537385),
        tags: ['Egg'],
      },
    ],
  },
  {
    id: 'desserts',
    label: 'Desserts',
    blurb: 'Sweet endings inspired by the bazaars of Old Delhi.',
    items: [
      {
        name: 'Gulab Jamun',
        description: 'Warm milk-solid dumplings soaked in rose and cardamom syrup.',
        price: 140,
        image: px(37294501),
        tags: ['Warm'],
        popular: true,
      },
      {
        name: 'Kesar Gulab Jamun',
        description: 'Saffron-infused gulab jamun garnished with slivered almonds and rose petals.',
        price: 180,
        image: px(7449105),
        tags: ['Saffron'],
      },
      {
        name: 'Dry Fruit Gulab Jamun',
        description: 'Stuffed with cashews and almonds, served with a drizzle of reduced cream.',
        price: 200,
        image: px(15014919),
        tags: ['Dry Fruit'],
      },
    ],
  },
  {
    id: 'beverages',
    label: 'Beverages',
    blurb: 'From street-side chai to cooling yogurt drinks.',
    items: [
      {
        name: 'Masala Chai',
        description: 'Black tea brewed with milk, ginger, cardamom, and a blend of whole spices.',
        price: 60,
        image: px(15023065),
        tags: ['Hot'],
        popular: true,
      },
      {
        name: 'Honey Ginger Chai',
        description: 'A soothing twist on classic chai, sweetened with raw honey.',
        price: 80,
        image: px(15023080),
        tags: ['Hot'],
      },
      {
        name: 'Spiced Latte',
        description: 'Espresso steamed with milk and a whisper of cinnamon and nutmeg.',
        price: 120,
        image: px(15023076),
        tags: ['Hot'],
      },
    ],
  },
];

export const galleryImages = [
  { src: px(12737817, 1200), alt: 'Plated biryani garnished with fried onions and herbs' },
  { src: px(35287413, 1200), alt: 'Biryani served in a rustic ceramic bowl' },
  { src: px(9027521, 1200), alt: 'Crispy samosas with green and tamarind chutneys' },
  { src: px(38043951, 1200), alt: 'Street vendor frying fresh samosas' },
  { src: px(32083370, 1200), alt: 'A spread of assorted Indian dishes' },
  { src: px(28674660, 1200), alt: 'Biryani served alongside a rich curry' },
  { src: px(35066813, 1200), alt: 'Garlic naan fresh from the tandoor' },
  { src: px(28674556, 1200), alt: 'Assorted Indian breads in a woven basket' },
];

export const heroImage = px(35066807, 1600);
export const aboutImage = px(35066811, 1200);
export const aboutImageSecondary = px(30203311, 1000);

export const restaurantInfo = {
  name: 'Spice Garden',
  tagline: 'A taste of India, crafted with soul.',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'hello@spicegarden.in',
  address: '14 MG Road, Indiranagar, Bengaluru, Karnataka 560038',
  hours: [
    { day: 'Monday – Thursday', time: '11:00 AM – 10:30 PM' },
    { day: 'Friday – Saturday', time: '11:00 AM – 11:30 PM' },
    { day: 'Sunday', time: '10:30 AM – 10:30 PM' },
  ],
};
