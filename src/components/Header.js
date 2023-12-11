import React, {useState, useContext, useEffect, useRef} from 'react';
import {ContextProvider, Context } from './Context';
import axios from './axios.js'
import "bootstrap/dist/css/bootstrap.min.css"

const Header = () => {

    const {
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
      requestTypes,
      setRequestTypes,
      appData,
      setAppData,
      attachments,
      setAttachments,
      pageList,
      setPageList,
      } = useContext(Context)

    

    const [showUserOptions, setShowUserOptions] = useState(false)
    const [userOptionsClassName, setUserOptionsClassName] = useState("d-flex flex-column p-1 border border-1 rounded rounded-3 shadow-sm")

    const [userData, setUserData]=useState({
      first_name: "",
      email: "",
    })

    const initializeUserData=()=>{
      let x = JSON.stringify(appData) 
      if(x.search("user_info")>0){
        setUserData(appData.user_info)
      }
    }

    useEffect(()=>{
      initializeUserData()
    },[appData, userLoggedIn])

    const menuIcon = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons/menu_icon.png"
    const menuIconStyle = {
        maxHeight: 50,
    cursor: "pointer"
    }

  const handleMenuOption=(elem)=>{
    if(elem == "newRequestButton"){
      let nextPage = "Home"
      setPageList([nextPage])
      setPageName(nextPage)
    }
    if(elem == "allRequestsButton"){
      let nextPage = "Requests"
      setPageList([nextPage])
      setPageName(nextPage)
    }
    if(elem == "updateButton"){
      let nextPage = "User Info"
      setPageList([nextPage])
      setPageName(nextPage)
    }
    if(elem == "signOutButton"){
      let nextPage = "Log In"
      setPageList([nextPage])
      setPageName(nextPage)
      setUserData({
        first_name: "",
        email: "",
      })
      setUser({})
      setAppData({})
      setUserLoggedIn(false)
    }
  }

  return (
            <div className="d-flex justify-content-end bg-light positin-fixed">
              {userLoggedIn && 
              <div className="d-flex flex-column p-2">
                <span className="text-secondary" style={{fontSize:12}}>Hello</span>
                <span className="text-primary fw-bold" style={{fontSize:16}}>{userData.first_name}</span>
              </div>}

              <div className="p-1"><img src={menuIcon} style={menuIconStyle} onClick={()=>setShowUserOptions(!showUserOptions)}></img></div>

              {showUserOptions &&
              <div className="position-absolute d-flex flex-column justify-content-end bg-white border border-1 rounded rounded-3 shadow shadow p-2" 
              style={{zIndex: 100, width: 200}}
              onMouseLeave={()=>setShowUserOptions(false)}
              >
                  <div className="d-flex flex-column justify-content-right flex-wrap mb-3 border-bottom">
                    <div style={{fontSize: 12}}>Signed in:</div>
                    <div className="fw-bold text-primary border-bottom-1 p-1" style={{fontSize: 12}}>{userData.full_name}</div>
                </div>
                  <button id="newRequestButton" name="newRequestButton" className="btn btn-light text-secondary mb-1 text-sm p-1" onClick={(e)=>handleMenuOption(e.target.id)}>New Request</button>
                    <button id="allRequestsButton" name="allRequestsButton" className="btn btn-light text-secondary mb-1 text-sm p-1" onClick={(e)=>handleMenuOption(e.target.id)}>All Requests</button>
                    <button id ="updateButton" name="updateButton" className="btn btn-light text-secondary mb-1 text-sm p-1" onClick={(e)=>handleMenuOption(e.target.id)}>Update Profile</button>
                    <button id="signOutButton" name="signOutButton" className="btn btn-light text-secondary mb-1 text-sm p-1" onClick={(e)=>handleMenuOption(e.target.id)}>Sign out</button>
              </div>
              }
            </div>
  )
}

export default Header