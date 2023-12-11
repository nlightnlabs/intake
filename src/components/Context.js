import React, { useState, createContext } from 'react'

export const Context = createContext(null);

export const ContextProvider = ({children}) =>{

    const [user, setUser] = useState("")
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [page, setPage] = useState({});
    const [pageName, setPageName] = useState("Log In");
    const [pages, setPages] = useState([])
    const [requestType, setRequestType] = useState({});
    const [requestTypes, setRequestTypes] = useState([])
    const [appData, setAppData] = useState({});
    const [attachments, setAttachments] = useState({});
    const [initialFormData, setInitialFormData] = useState({})
   

    const [pageList, setPageList] = useState([])

    const globalStates = {
        user,
        setUser,
        userLoggedIn,
        setUserLoggedIn,
        page,
        setPage,
        pages,
        setPages,
        pageName,
        setPageName,
        requestType,
        setRequestType,
        appData,
        setAppData,
        attachments,
        setAttachments,
        pageList,
        setPageList,
        requestTypes,
        setRequestTypes,
        initialFormData,
        setInitialFormData
    }

    return(
        <Context.Provider value={globalStates}>{children}</Context.Provider>
    )
}