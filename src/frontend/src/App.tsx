import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import Game from "./components/Game";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

export default function App() {
  const queryClient = useQueryClient();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const isAuthenticated = !!identity;

  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [startLevel, setStartLevel] = useState(0);

  // Check admin status whenever actor or identity changes
  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .isAdmin()
      .then((admin) => {
        setIsAdmin(admin);
        if (admin) {
          // Load persisted start level for admin
          return actor.getStartLevel().then((lvl) => {
            const level = Number(lvl);
            setSelectedLevel(level);
            setStartLevel(level);
          });
        }
        setIsAdmin(false);
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, [actor, isFetching]);

  // Reset admin state on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false);
      setSelectedLevel(0);
      setStartLevel(0);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    clear();
    queryClient.clear();
    setIsAdmin(false);
    setSelectedLevel(0);
    setStartLevel(0);
  };

  const handleSelectLevel = async (level: number) => {
    setSelectedLevel(level);
    setStartLevel(level);
    if (actor) {
      try {
        await actor.setStartLevel(BigInt(level));
      } catch {
        // Silently ignore — local state already updated
      }
    }
  };

  return (
    <Game
      startLevel={startLevel}
      isAuthenticated={isAuthenticated}
      isAdmin={isAdmin}
      selectedLevel={selectedLevel}
      loginStatus={loginStatus}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onSelectLevel={handleSelectLevel}
    />
  );
}
