/**
 * useSession hook - localStorage token management
 */
export const useSession = () => {
  const SS = {
    get tok() {
      return localStorage.getItem('sr_tok');
    },
    get ref() {
      return localStorage.getItem('sr_ref');
    },
    get uid() {
      return localStorage.getItem('sr_uid');
    },
    get mail() {
      return localStorage.getItem('sr_mail');
    },
    set(idToken, refreshToken, uid, email) {
      localStorage.setItem('sr_tok', idToken);
      localStorage.setItem('sr_ref', refreshToken);
      localStorage.setItem('sr_uid', uid);
      localStorage.setItem('sr_mail', email);
    },
    clear() {
      localStorage.removeItem('sr_tok');
      localStorage.removeItem('sr_ref');
      localStorage.removeItem('sr_uid');
      localStorage.removeItem('sr_mail');
    },
    get ok() {
      return !!(this.tok && this.uid);
    }
  };

  return SS;
};
