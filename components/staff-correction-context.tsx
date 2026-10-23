'use client';

import {createContext,useContext,useMemo,useState,type ReactNode} from 'react';

type Section='personal'|'employment';
type CorrectionContextValue={pending:Section|null;setPending:(section:Section|null)=>void};
const CorrectionContext=createContext<CorrectionContextValue|null>(null);

export function StaffCorrectionProvider({children}:{children:ReactNode}){
 const [pending,setPending]=useState<Section|null>(null),value=useMemo(()=>({pending,setPending}),[pending]);
 return <CorrectionContext.Provider value={value}>{children}</CorrectionContext.Provider>;
}
export function useStaffCorrection(){const value=useContext(CorrectionContext);if(!value)throw new Error('STAFF_CORRECTION_CONTEXT_REQUIRED');return value;}
