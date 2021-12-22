import React, { useEffect } from 'react';
import { useRokt } from '../context/rokt';

export function ConfirmationPage() {
  const rokt = useRokt();

  useEffect(() => {
    rokt.setAttributes({
      email: 'user@example.com',
    });
    rokt.triggerPageChange('checkout.page');

    return () => {
      rokt.closeAll();
    };
  }, [rokt]);

  return (
    <div>
      <h1>Confirmation Page</h1>
      <div id="rokt-placeholder"/>
    </div>
  );
}