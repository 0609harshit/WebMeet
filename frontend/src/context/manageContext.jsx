import { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({children}) => {

    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");

    const manageContextOnLogin = (data) => {
        setName(data.name);
        setUserName(data.userName);
    }

    const data = {name, userName, manageContextOnLogin};

    return(
        <Context.Provider value={data}>
            {children}
        </Context.Provider>
    )
}