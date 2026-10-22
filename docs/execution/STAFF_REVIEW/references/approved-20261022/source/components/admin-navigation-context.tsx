'use client';

import {createContext,useContext,type ReactNode} from 'react';

export type AdminNavigationDestination=Readonly<{label:string;href:string;area:string}>;

const AdminNavigationContext=createContext<readonly AdminNavigationDestination[]>([]);

export function AdminNavigationProvider({destinations,children}:{destinations:readonly AdminNavigationDestination[];children:ReactNode}){
 return <AdminNavigationContext.Provider value={destinations}>{children}</AdminNavigationContext.Provider>;
}

export function useAdminNavigationDestinations(){return useContext(AdminNavigationContext);}
