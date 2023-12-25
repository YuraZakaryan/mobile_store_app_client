import {
  EPacking,
  IBasketItem,
  IOrder,
  IProductHistory,
  TCategory,
  TProduct,
  TUser,
} from '../types';

export const userMock = {
  _id: '354135',
  firstname: 'Մուշեղ',
  lastname: 'Օհանյան',
  username: 'varo2023',
  role: 'ADMIN',
  phone: '+374-44-77-67-57',
  status: true,
};

export const usersMock: TUser[] = [
  {
    _id: '435435',
    firstname: 'Մուշեղ',
    lastname: 'Օհանյան',
    username: 'varo2023',
    phone: '+374-44-77-67-57',
    role: 'USER',
    confirmed: true,
  },
  {
    _id: '432423',
    firstname: 'Կարինե',
    lastname: 'Թոփալյան',
    username: 'varo2023',
    phone: '+374-44-77-67-57',
    role: 'ADMIN',
    confirmed: false,
  },
  {
    _id: '546544',
    firstname: 'Կարապետ',
    lastname: 'Մելքոնյան',
    username: 'varo2023',
    phone: '+374-44-77-67-57',
    role: 'ADMIN',
    confirmed: false,
  },
  {
    _id: '5464574',
    firstname: 'Թոռնիկ',
    lastname: 'Բղդոյան',
    username: 'varo2023',
    phone: '+374-44-77-67-57',
    role: 'ADMIN',
    confirmed: false,
  },
];

export const historyProducts: IProductHistory[] = [
  {
    _id: '21312321',
    title: 'Iphone 15 Pro Max',
    category: 'phone',
    picture: 'https://www.mobilecentre.am/img/prodpic/1061e9def6b2ad85a345Новый_проект__5_.png',
    price: 72500,
    code: 12345,
    discount: 0,
    orderCount: 6,
    created_at: '2012-10-15T23:26:17Z',
  },
  {
    _id: '13123123',
    title: 'Samsung Galaxy S23',
    category: 'phone',
    picture: 'https://www.mobilecentre.am/img/prodpic/1061e9def6b2ad85a345Новый_проект__5_.png',
    price: 28000,
    code: 15313,
    discount: 0,
    orderCount: 2,
    created_at: '2012-10-15T23:26:17Z',
  },
  {
    _id: '23432423',
    title: 'Iphone 12 mini',
    category: 'phone',
    picture: 'https://www.mobilecentre.am/img/prodpic/1061e9def6b2ad85a345Новый_проект__5_.png',
    price: 200000,
    code: 84566,
    discount: 0,
    orderCount: 4,
    created_at: '2012-10-15T21:23:17Z',
  },
  {
    _id: '52352342',
    title: 'Xiaomi 13 Pro',
    category: 'phone',
    picture: 'https://www.mobilecentre.am/img/prodpic/1061e9def6b2ad85a345Новый_проект__5_.png',
    price: 613500,
    code: 99445,
    discount: 0,
    orderCount: 1,
    created_at: '2012-10-15T22:26:17Z',
  },
];
export const productsMock: TProduct[] = [
  {
    _id: '32423412',
    title: 'Iphone 15 Pro Max',
    category: 'phone',
    picture: 'https://www.mobilecentre.am/img/prodpic/1061e9def6b2ad85a345Новый_проект__5_.png',
    price: 725000,
    code: 12345,
    discount: 5,
    created_at: '2012-10-15T23:26:17Z',
  },
  {
    _id: '2322423',
    title: 'Iphone 12 Mini',
    category: 'phone',
    picture: 'https://www.mobilecentre.am/img/prodpic/1061e9def6b2ad85a345Новый_проект__5_.png',
    price: 200000,
    code: 12345,
    discount: 12,
    created_at: '2012-10-15T23:26:17Z',
  },
  {
    _id: '2342353',
    title: 'Samsung Galaxy S23 Ultra 256GB',
    category: 'phone',
    picture: 'https://www.mobilecentre.am/img/prodpic/1061e9def6b2ad85a345Новый_проект__5_.png',
    price: 380000,
    code: 12345,
    discount: 0,
    created_at: '2012-10-15T23:26:17Z',
  },
  {
    _id: '34654645',
    title: 'Xiaomi 13 Pro',
    category: 'phone',
    picture: 'https://www.mobilecentre.am/img/prodpic/1061e9def6b2ad85a345Новый_проект__5_.png',
    price: 299000,
    code: 12345,
    discount: 0,
    created_at: '2012-10-15T23:26:17Z',
  },
  {
    _id: '13242342',
    title: 'Nokia 6300',
    category: 'phone',
    picture: 'https://www.mobilecentre.am/img/prodpic/1061e9def6b2ad85a345Новый_проект__5_.png',
    price: 63000,
    code: 12345,
    discount: 0,
    created_at: '2012-10-15T23:26:17Z',
  },
];

export const categoryMock: TCategory[] = [
  {
    _id: '351351',
    title: 'Մկնիկ',
    description: 'Սովորական մկնիկ',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '123242',
    title: 'Ստեղնաշարss',
    description: 'Սովորական Ստեղնաշար',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '543534',
    title: 'Խաղային համակարգիչներ',
    description: 'Սովորական Խաղային համակարգիչներ',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '645635',
    title: 'Ականջակալներ',
    description: 'Սովորական Ականջակալներ',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '123123',
    title: 'Մկնիկ',
    description: 'Սովորական մկնիկ',
    picture: '',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '345344',
    title: 'Ստեղնաշար',
    description: 'Սովորական Ստեղնաշար',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '634522',
    title: 'Խաղային համակարգիչներ',
    description: 'Խաղային համակարգիչներ',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '232233',
    title: 'Ականջակալներ',
    description: 'Սովորական Ականջակալներ',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '435423',
    title: 'Մկնիկ',
    description: 'Սովորական մկնիկ',
    picture: '',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '654745',
    title: 'Ստեղնաշար',
    description: 'Սովորական Ստեղնաշար',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '876543',
    title: 'Խաղային համակարգիչներ',
    description: 'Սովորական Խաղային համակարգիչներ',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
  {
    _id: '865635',
    title: 'Ականջակալներ',
    description: 'Սովորական Ականջակալներ',
    picture:
      'https://media.wired.com/photos/654bbda3f4edd2e53e479c0b/4:3/w_1891,h_1418,c_limit/_Logitech-MX-Keys-S-Wireless-Keyboard-Gear.jpg',
    created_at: '',
    author: 'dwada',
  },
];
export const basketProducts: IBasketItem[] = [
  {
    _id: '21312321',
    title: 'Iphone 15 Pro Max',
    category: 'phone',
    picture: '',
    price: 72500,
    code: 12345,
    orderCount: 6,
    discount: 5,
    user: usersMock[0],
    created_at: '2012-10-15T23:26:17Z',
  },
  {
    _id: '13123123',
    title: 'Samsung Galaxy S23',
    category: 'phone',
    picture: '',
    price: 28000,
    code: 15313,
    orderCount: 2,
    discount: 5,
    user: usersMock[1],
    created_at: '2012-10-15T23:26:17Z',
  },
  {
    _id: '23432423',
    title: 'Iphone 12 mini',
    category: 'phone',
    picture: '',
    price: 200000,
    code: 84566,
    orderCount: 4,
    discount: 5,
    user: usersMock[2],
    created_at: '2012-10-15T21:23:17Z',
  },
  {
    _id: '52352342',
    title: 'Xiaomi 13 Pro',
    category: 'phone',
    picture: '',
    price: 613500,
    code: 99445,
    orderCount: 1,
    discount: 5,
    user: usersMock[3],
    created_at: '2012-10-15T22:26:17Z',
  },
];

export const ordersMock: IOrder[] = [
  {
    _id: '4124324532',
    user: usersMock[0],
    items: basketProducts,
    packaging: EPacking.BAG,
    necessaryNotes: '',
    status: 'neutral',
    orderStartTime: '2012-10-15T22:20:17Z',
    orderCompletedTime: '',
    created_at: '2012-10-15T22:26:17Z',
  },
  {
    _id: '213123213',
    user: usersMock[1],
    items: basketProducts,
    packaging: EPacking.BAG,
    necessaryNotes: '',
    status: 'completed',
    orderStartTime: '2012-10-15T22:20:17Z',
    orderCompletedTime: '2012-10-15T23:46:17Z',
    created_at: '2012-10-15T22:26:17Z',
  },
  {
    _id: '1231231321',
    user: usersMock[2],
    items: basketProducts,
    packaging: EPacking.BAG,
    necessaryNotes: '',
    status: 'neutral',
    orderStartTime: '2012-10-15T22:20:17Z',
    orderCompletedTime: '2012-10-15T23:46:17Z',
    created_at: '2012-10-15T22:26:17Z',
  },
];