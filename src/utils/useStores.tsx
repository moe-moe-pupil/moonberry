import React, { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { storesContext } from '@/stores';

export function useStores() {
  //return useContext(MobXProviderContext);
  return useContext(storesContext);
}
