import React, {useState, useEffect, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import { Context } from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import SuccessIcon from './success_icon.svg';
import {toProperCase} from './formatValue.js'

const RequestSummary = () => {

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
        appData,
        setAppData,
        attachments,
        setAttachments,
        pageList,
        setPageList,
        requestTypes,
        setRequestTypes
      } = useContext(Context)

let formData = {}

const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  
 const boxStyle={
    width: "100%",
    maxHeight: "300px",
    overflowY: "auto",
 }

 const [files, setFiles] = useState([])

 useEffect(()=>{
    let x = Array.from(attachments)
    setFiles(x)

    console.log(appData)
    console.log(page)
    console.log(pageList)

 },[])

 const handleSubmit = (e)=>{
    setPage("Home")
 }


  return (
    <div className = {pageClass}>
        <div className="row">
            <div className="col"></div>

            <div className="col-lg-8">
            
                <h1 className="text-center">Thank You</h1>
                <h4 className="text-center">Your request is being reviewed</h4>
                <p className="text-center">You will be notified if further information is needed</p>

                <div className="d-flex justify-content-center animate__animated animate__heartbeat animate__duration-0.5s" style={{height: 150, overflow: "hidden"}}>
                    <img  src={SuccessIcon} style={{height: 125} }alt="Success Icon"/>
                </div>
                
                <div className="=flex-fill shadow shadow-lg rounded-top-2" style={{backgroundImage: "linear-gradient(45deg, rgb(9, 128, 243), rgb(0, 223, 255))", height:25}}></div>
                
                <div className="box d-flex flex-column border border-1 rounded-2 bg-light shadow p-3" style={boxStyle}>
                    <table className="table">
                        <tbody>
                            {
                            Object.keys(appData).map((attr, index) => (
                            attr !=="user_info" && 
                            <table style={{fontSize: 14, width: "100%"}}>
                            <tbody>
                                <div className="bg-light p-0 w-100" style={{fontSize: 24}}>{toProperCase(attr.replaceAll("_"," "))}</div>
                                {Object.keys(appData[attr]).map((item,index2)=>(
                                    <tr style={{borderTop: "1px solid lightgray", height: 16, paddingLeft: 20, paddingRight: 10}} key={index2}>
                                        <td style={{width: "25%"}}>{toProperCase(item.replaceAll("_"," "))}</td>
                                        <td style={{width: "70%"}}>
                                            {item && typeof appData[attr][item] ==="object" && Array.isArray(appData[attr][item]) && item=="attachments"?
                                                <ul>
                                                    {(appData[attr][item]).map((obj, index3)=>(
                                                        obj && <li key={index3}><a href={`${obj["url"]}`}>{obj["name"]}</a></li>
                                                    ))}  
                                                </ul>
                                            :
                                            item && typeof appData[attr][item] ==="object" && Array.isArray(appData[attr][item])? 
                                                <ul>
                                                    {(appData[attr][item]).map((obj, index3)=>(
                                                        obj && <li key={index3}>{JSON.stringify(obj).replace(/[\[\]{\}/'/"]/g,'').replaceAll(/,/g,", ").replaceAll(/:/g,": ")}</li>
                                                    ))}  
                                                </ul>
                                            :
                                                item && typeof appData[attr][item] === "object" && !Array.isArray(appData[attr][item])?
                                                <ul>
                                                    {Object.keys(appData[attr][item]).map((obj, index3)=>(
                                                        obj && <li key={index3}>{JSON.stringify([obj]).replace(/[\[\]{\}/'/"]/g,'').replaceAll(/,/g,", ").replaceAll(/:/g,": ")}</li>
                                                    ))}  
                                                </ul>
                                            :
                                            item && typeof appData[attr][item] === "string"?
                                                <span>{appData[attr][item]}</span>
                                            :
                                            <div>{JSON.stringify(appData[attr][item])}</div>
                                            }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                            ))} 
                        </tbody>
                    </table>
                    
                </div>

                <div className="d-flex justify-content-center mt-5">
                
                <div className="btn-group">
                    <button name="againButton" className="btn btn-outline-primary" data-bs-toggle="button" type="submit" onClick={handleSubmit}>Request Again</button>
                    <button name="homeButton" className="btn btn-outline-secondary" data-bs-toggle="button" type="submit" onClick={handleSubmit}>Leave</button>
                </div>
                </div>
                
                
            </div>
            <div className="col"></div>
        </div>
      
    </div>
  )
}

export default RequestSummary