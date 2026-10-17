'use client';

import React, { createContext, useContext } from 'react';

export interface AppUser { id: string; name: string; phone: string; role: string; state: string; district: string }

const Ctx = createContext<AppUser | null>(null);
export const UserProvider = ({ user, children }: { user: AppUser; children: React.ReactNode }) => <Ctx.Provider value={user}>{children}</Ctx.Provider>;
export const useUser = () => useContext(Ctx);
