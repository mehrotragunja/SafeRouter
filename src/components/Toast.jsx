import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Toast() {
  const { toast } = useContext(AppContext);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.msg}
    </div>
  );
}

export default Toast;
