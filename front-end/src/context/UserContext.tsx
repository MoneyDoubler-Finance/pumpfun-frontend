"use client"
import { msgInfo, userInfo } from '@/utils/types';
import { createContext, useContext, useState, ReactNode } from 'react';

const UserContext = createContext({
    user: {} as userInfo,
    setUser: (value: userInfo) => { },
    login: false,
    setLogin: (value: boolean) => { },
    isLoading: false,
    setIsLoading: (value: boolean) => { },
    imageUrl: '/*.png',
    setImageUrl: (value: string) => { },
    isCreated: false,
    setIsCreated: (value: boolean) => { },
    messages: [] as msgInfo[],
    setMessages: (value: msgInfo[]) => { },
    coinId: "",
    setCoinId: (value: string) => { },
    newMsg: {} as msgInfo,
    setNewMsg: (value: msgInfo) => { },
    solPrice: 0,
    setSolPrice: (value: number) => { },
    profileEditModal: false,
    setProfileEditModal: (value: boolean) => { },
    postReplyModal: false,
    setPostReplyModal: (value: boolean) => { },
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<userInfo>({} as userInfo);
    const [login, setLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('/*.png');
    const [isCreated, setIsCreated] = useState(false);
    const [messages, setMessages] = useState<msgInfo[]>([]);
    const [coinId, setCoinId] = useState("");
    const [newMsg, setNewMsg] = useState<msgInfo>({} as msgInfo);
    const [solPrice, setSolPrice] = useState(0);
    const [profileEditModal, setProfileEditModal] = useState(false);
    const [postReplyModal, setPostReplyModal] = useState(false);

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            login,
            setLogin,
            isLoading,
            setIsLoading,
            imageUrl,
            setImageUrl,
            isCreated,
            setIsCreated,
            messages,
            setMessages,
            coinId,
            setCoinId,
            newMsg,
            setNewMsg,
            solPrice,
            setSolPrice,
            profileEditModal,
            setProfileEditModal,
            postReplyModal,
            setPostReplyModal,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext; 