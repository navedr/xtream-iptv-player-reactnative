import * as React from "react";

interface IAccountContext {
    url: string;
    user: string;
    password: string;
}

export const AccountContext = React.createContext<IAccountContext>({
    url: "",
    user: "",
    password: "",
});
