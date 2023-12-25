import React from 'react';

import { Login } from './ui/login';
import { Registration } from './ui/registration';
import { useAppSelector } from '../../../hooks/redux';
import { EAuthMode } from '../../../redux/types';

export const Auth = () => {
  const { authMode } = useAppSelector((state) => state.user);
  return <>{authMode === EAuthMode.LOGIN ? <Login /> : <Registration />}</>;
};
