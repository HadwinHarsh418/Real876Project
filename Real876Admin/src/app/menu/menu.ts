import { CoreMenu } from '@core/types';

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'home',
    url: 'dashboard'
  },
  {
    id: 'products',
    title: 'Products',
    type: 'item',
    icon: 'package',
    fontAwesomeIcon: 'package',    
    url: 'products'
  },
  {
    id: 'users',
    title: 'Users',
    type: 'item',
    icon: 'user',
    fontAwesomeIcon: 'package',    
    url: 'users'
  },
  

];
