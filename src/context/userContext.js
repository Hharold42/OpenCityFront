import { createContext, useContext, useEffect, useState } from "react";
import { getUserByToken } from "../utils/controllers/userController";

const UContext = createContext();

export const useUser = () => useContext(UContext);

const UserContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserByToken = async () => {
      const userData = await getUserByToken(session);
      setUser(userData);
    };

    console.log(session);
    const token = localStorage.getItem("opencity-token");
    if (!session && token) setSession(token);
    if (session && !user) {
      fetchUserByToken();
    }
  }, [session, user]);

  const providerValues = {
    session,
    setSession,
    user,
    setUser
  };

  return (
    <UContext.Provider value={providerValues}>{children}</UContext.Provider>
  );
};

export default UserContextProvider;
