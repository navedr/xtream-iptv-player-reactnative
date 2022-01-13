import * as React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import login from "../api/login";
import { v4 as uuid } from "uuid";

export interface IAccount {
    id: string;
    name: string;
    url: string;
    username: string;
    password: string;
}

interface IAccountContext {
    accounts: IAccount[];
    current?: IAccount;
    add?: (name: string, url: string, username: string, password: string) => Promise<string>;
    remove?: (id: string) => void;
    setAsCurrent?: (id: string) => void;
    getCurrentAccountInfo?: () => Promise<any>;
}

export const AccountContext = React.createContext<IAccountContext>({
    accounts: [],
});

export const AccountContextConsumer = AccountContext.Consumer;

export const useAccountContext: () => IAccountContext = () => React.useContext(AccountContext);

export const AccountContextProvider = React.memo<{ children?: React.ReactNode }>(({ children }) => {
    let [accounts, setAccounts] = React.useState<IAccount[]>([]);
    const [current, setCurrent] = React.useState<IAccount>(null);

    const accountsStorageName = `@IPTVPlayer:AccountsV2`;
    const currentAccountStorageName = `@IPTVPlayer:CurrentAccount`;

    const updateStorage = (accounts: IAccount[]) => {
        AsyncStorage.setItem(accountsStorageName, JSON.stringify(accounts));
    };

    const add = async (name: string, url: string, username: string, password: string) => {
        if (accounts.some(a => a.url === url && a.username === username && a.password === password)) {
            return "Account already exists";
        }
        if (accounts.some(a => a.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
            return "Account with same name already exists";
        }
        try {
            const loginReply = await login(url, username, password);

            if (loginReply.user_info.auth !== 1) {
                return "Invalid Account";
            }
        } catch (error) {
            return error;
        }

        accounts.push({
            id: uuid(),
            name,
            url,
            username,
            password,
        });
        setAccounts(accounts);
        updateStorage(accounts);
        if (accounts.length === 1) {
            setAsCurrent(accounts[0].id);
        }
    };

    const remove = (id: string) => {
        accounts = accounts.filter(a => a.id !== id);
        setAccounts(accounts);
        updateStorage(accounts);
        if (current?.id === id) {
            setAsCurrent(null);
        }
    };

    const setAsCurrent = (id: string) => {
        const account = accounts.find(a => a.id === id);
        setCurrent(account);
        if (!account?.id) {
            AsyncStorage.removeItem(currentAccountStorageName);
        } else {
            AsyncStorage.setItem(currentAccountStorageName, account?.id);
        }
    };

    const getCurrentAccountInfo = async () => {
        if (!current) {
            return null;
        }
        const { username, password, url } = current;
        try {
            const loginReply = await login(url, username, password);

            if (loginReply?.user_info.auth === 1) {
                return loginReply.user_info;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };

    React.useEffect(() => {
        AsyncStorage.getItem(accountsStorageName).then(data => {
            if (data) {
                setAccounts(JSON.parse(data));
                AsyncStorage.getItem(currentAccountStorageName).then(id => {
                    if (id) {
                        setAsCurrent(id);
                    }
                });
            }
        });
    }, []);

    return (
        <AccountContext.Provider
            value={{
                accounts,
                current,
                add,
                remove,
                setAsCurrent,
                getCurrentAccountInfo,
            }}>
            {children}
        </AccountContext.Provider>
    );
});
