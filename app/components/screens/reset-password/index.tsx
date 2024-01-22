import React from 'react';

import { MailSection, NewPassSection, OtpSection } from './ui';
import { useAppSelector } from '../../../hooks/redux';
import { EResetPasswordMode } from '../../../redux/types';

export const ResetPassword = () => {
  const { resetPassword } = useAppSelector(({ user }) => user);

  const sectionComponent = (() => {
    switch (resetPassword.mode) {
      case EResetPasswordMode.MAIL_SECTION:
        return <MailSection />;
      case EResetPasswordMode.OPT_SECTION:
        return <OtpSection />;
      case EResetPasswordMode.NEW_PASS_SECTION:
        return <NewPassSection />;
    }
  })();

  return <>{sectionComponent}</>;
};
