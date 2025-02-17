import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Tents from './components/Tents';
import Cottages from './components/Cottages';
import FarmHouses from './components/FarmHouses';
import Hotels from './components/Hotels';
import Homestays from './components/Homestays';
import Treehouses from './components/Treehouses';
import Villas from './components/Villas';
// import { createBrowserRouter } from '@backstage/core';
export let router = createBrowserRouter([
  {
    path: '/tents',
    element: <Tents />
  },
  {
    path: '/cottages',
    element: <Cottages />
  },
  {
    path: '/farmhouses',
    element: <FarmHouses/>
  },
  {
    path: '/hotels',
    element: <Hotels/>
  },
  {
    path: '/homestays',
    element: <Homestays />
    
  }
  ,
  {
    path: '/treehouses',
    element: <Treehouses />
    
  }
  ,
  {
    path: '/villas',
    element: <Villas />
    
  }
])