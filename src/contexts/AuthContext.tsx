import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userType: string | null;
  signUp: (
    email: string,
    password: string,
    userData: { first_name: string; last_name: string; user_type: string }
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const redirectUserByRole = (type: string | null) => {
    if (!type) return;
    if (type === 'admin') router.push('/dashboard/admin');
    else if (type === 'recruteur') router.push('/dashboard/recruteur');
    else if (type === 'candidat') router.push('/dashboard/candidat');
    else router.push('/');
  };

  const fetchUserTypeFromProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (!error && data?.user_type) {
      setUserType(data.user_type);
      redirectUserByRole(data.user_type);
    } else {
      setUserType(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        const metaType = session?.user?.user_metadata?.user_type;

        if (metaType) {
          setUserType(metaType);
          redirectUserByRole(metaType);
          setLoading(false);
        } else if (session?.user?.id) {
          fetchUserTypeFromProfile(session.user.id);
        } else {
          setUserType(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      const metaType = session?.user?.user_metadata?.user_type;

      if (metaType) {
        setUserType(metaType);
        redirectUserByRole(metaType);
        setLoading(false);
      } else if (session?.user?.id) {
        fetchUserTypeFromProfile(session.user.id);
      } else {
        setUserType(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: { first_name: string; last_name: string; user_type: string }
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData,
        },
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) return { error };

      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .single();

      const type = profileData?.user_type ?? null;
      setUserType(type);
      redirectUserByRole(type);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    const { error } = await signOut();
    if (error) console.error('Logout error:', error);
  };

  const value = {
    user,
    session,
    loading,
    userType,
    signUp,
    signIn,
    signOut,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
