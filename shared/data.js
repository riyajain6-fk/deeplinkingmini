export const PRODUCTS = [
  {
    id: 'milk-1l',
    name: 'Amul Gold Milk 1L',
    price: 68,
    category: 'dairy',
  },
  {
    id: 'bread-ww',
    name: 'Britannia Whole Wheat Bread',
    price: 45,
    category: 'bakery',
  },
  {
    id: 'eggs-12',
    name: 'Farm Fresh Eggs 12pc',
    price: 89,
    category: 'dairy',
  },
  {
    id: 'chips-lays',
    name: 'Lays Classic Salted 26g',
    price: 20,
    category: 'snacks',
  },
  {
    id: 'atta-5kg',
    name: 'Aashirvaad Atta 5kg',
    price: 280,
    category: 'staples',
  },
];

export const CATEGORIES = [
  {id: 'dairy', name: 'Dairy & Eggs'},
  {id: 'bakery', name: 'Bakery & Bread'},
  {id: 'snacks', name: 'Snacks & Drinks'},
  {id: 'staples', name: 'Staples & Grains'},
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}
