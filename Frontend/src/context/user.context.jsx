    import { createContext, useState} from 'react';

    export const UserContext = createContext();

    export const UserProvider = ({ children }) => {
        const [user, setUser] = useState(() => {
          const savedUser = localStorage.getItem('user');
          return savedUser ? JSON.parse(savedUser) : null;
        });
      
        const value = {
          user,
          setUser: (user) => {
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
            } else {
              localStorage.removeItem('user');
            }
            setUser(user);
          },
        };
      
        return <UserContext.Provider 
        value={value}>
            {children}
            </UserContext.Provider>;
      };
      
