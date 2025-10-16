import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ModelContext = createContext(null);

export const ModelProvider = ({ children }) => {
    const [activeModel, setActiveModel] = useState(() => {
        const raw = localStorage.getItem('active_model');
        return raw ? JSON.parse(raw) : null;
    });

    useEffect(() => {
        if (activeModel) localStorage.setItem('active_model', JSON.stringify(activeModel));
        else localStorage.removeItem('active_model');
    }, [activeModel]);

    const clearActiveModel = () => setActiveModel(null);

    const value = useMemo(() => ({ activeModel, setActiveModel, clearActiveModel }), [activeModel]);
    return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};

export const useModel = () => {
    const ctx = useContext(ModelContext);
    if (!ctx) throw new Error('useModel must be used within ModelProvider');
    return ctx;
};


