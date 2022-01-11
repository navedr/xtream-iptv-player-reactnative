import * as React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import login from "../api/login";

export interface IAccount {
    id: string;
    url: string;
    username: string;
    password: string;
}

interface IAccountContext {
    accounts: IAccount[];
    current?: IAccount;
    add?: (id: string, url: string, username: string, password: string) => Promise<string>;
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

    const accountsStorageName = `@IPTVPlayer:Accounts`;
    const currentAccountStorageName = `@IPTVPlayer:CurrentAccount`;

    const updateStorage = React.useCallback(
        (accounts: IAccount[]) => {
            AsyncStorage.setItem(accountsStorageName, JSON.stringify(accounts));
        },
        [accounts],
    );

    const add = React.useCallback(
        async (id: string, url: string, username: string, password: string) => {
            if (
                accounts.some(a => a.id === id || (a.url === url && a.username === username && a.password === password))
            ) {
                return "Account already exists";
            }
            try {
                const loginReply = await login(url, username, password);

                if (loginReply.user_info.auth === 1) {
                    // navigate("Account", {
                    //     url,
                    //     username,
                    //     password,
                    //     user_info: loginReply.user_info,
                    // });
                } else {
                    return "Invalid Account";
                }
            } catch (error) {
                return error;
            }

            accounts.push({
                id,
                url,
                username,
                password,
            });
            setAccounts(accounts);
            updateStorage(accounts);
            if (accounts.length === 1) {
                setAsCurrent(accounts[0].id);
            }
        },
        [accounts],
    );

    const remove = React.useCallback(
        (id: string) => {
            accounts = accounts.filter(a => a.id !== id);
            setAccounts(accounts);
            updateStorage(accounts);
            if (current?.id === id) {
                setAsCurrent(null);
            }
        },
        [accounts],
    );

    const setAsCurrent = React.useCallback(
        (id: string) => {
            const account = accounts.find(a => a.id === id);
            setCurrent(account);
            AsyncStorage.setItem(currentAccountStorageName, account?.id);
        },
        [accounts],
    );

    const getCurrentAccountInfo = React.useCallback(async () => {
        const { username, password, url } = current;
        try {
            const loginReply = await login(url, username, password);

            if (loginReply.user_info.auth === 1) {
                return loginReply.user_info;
            } else {
                return "Invalid Account";
            }
        } catch (error) {
            return error;
        }
    }, []);

    React.useEffect(() => {
        AsyncStorage.getItem(accountsStorageName).then(data => {
            console.log(data);
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
