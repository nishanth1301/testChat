import React, { ReactElement, useLayoutEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export interface AuthContextProp {
  login: any;
  logout: () => void;
  user: any;
  conversation: any;
  messages: any;
  sendMessage: any;
}

interface AuthProviderProps {
  children: ReactElement;
}
const AuthContext = React.createContext<AuthContextProp | null>(null);
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{ id: string }>();
  const [token, setToken] = useState<string | undefined>(
    sessionStorage.getItem("auth") || undefined
  );
  const [conversation, setConverstion] = useState([]);
  const [isLoggedIn, setIsLoggedIn]: [boolean, Function] = useState(false);
  // const navigate = useNavigate();

  const handleLogin = async (params: any) => {
    setIsLoggedIn(true);
    sessionStorage.clear();
    const res = await api.signIn(params.email, params.password);
    setIsLoggedIn(false);
    const { success, token, error } = res || {};
    if (success) {
      sessionStorage.setItem("auth", token);
      refreshUser();
      await loadConversation();
    } else {
      setIsLoggedIn(false);
    }
    return { success, error };
  };

  const messages = async (id: string) => {
    const res = await api.messages(id);
    return res;
  };

  const sendMessage = async (id: string, params: any) => {
    const res = await api.createMessages(id, params);
    return res;
  };
  const loadConversation = async () => {
    setIsLoggedIn(true);
    const data = await api.conversation();
    setIsLoggedIn(false);
    if (data) {
      setConverstion(data);
    } else {
      return false;
    }
  };
  const refreshUser = async () => {
    setIsLoggedIn(true);
    const { success, user } = await api.user();
    setIsLoggedIn(false);
    if (success) {
      setUser(user);
    } else {
      return false;
    }
  };
  const logout = () => {
    sessionStorage.clear();
  };

  useLayoutEffect(() => {
    if (token) {
      getCurrentUser();
      loadConversation();
    } else {
      if (!token) {
        logout();
      }
    }
  }, [token]);

  const getCurrentUser = async () => {
    const { success, user } = await api.user();

    if (success) {
      setUser(user);
    } else {
      // sessionStorage.removeItem("auth");
      // sessionStorage.removeItem("i18nextLng");
      // navigate("/login");
      return false;
    }
  };

  const value: AuthContextProp = {
    login: handleLogin,
    logout,
    user,
    conversation,
    messages: messages,
    sendMessage: sendMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthentication = () => React.useContext(AuthContext);
export { AuthProvider, useAuthentication };
