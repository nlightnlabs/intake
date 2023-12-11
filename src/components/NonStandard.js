import React, {useState, useEffect, useContext, useRef, createRef} from 'react'
import { Context } from "./Context.js"
import axios from './axios.js'
import "bootstrap/dist/css/bootstrap.min.css"

import 'animate.css';

const NonStandard = () => {

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

  const [categoryData, setCategoryData] = useState([])
  const [categories, setCategories] = useState([])
  const [businessData, setBusinessData] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [currencySymbol, setCurrencySymbol] = useState("$")

  const [formClassList, setFormClassList] = useState("form-group")

  const [softwareUsers, setSoftwareUsers] = useState([
    {name: "", email:""},
    {name: "", email:""},
    {name: "", email:""}
  ])


  const usernameRefs = useRef([]);
  usernameRefs.current = softwareUsers.map(
      (ref, index) =>   usernameRefs.current[index] = createRef(index)
    )


  const getCategories = async ()=>{
    const response = await axios.get('/db/table/software_products')
    const data = await response.data
    setCategoryData(data)

    let categorySet = new Set()
      await data.forEach(item=>{
        categorySet.add(item.software)
      })
      
      let categoryList = [...categorySet]
      setCategories(categoryList.sort())

      let supplierSet = new Set()
      await data.forEach(item=>{
        supplierSet.add(item.supplier)
      })
      
      let supplierList = [...supplierSet]
      setBusinesses(supplierList.sort())
  }

  const handleChange = (e)=>{
    const {name, value} = e.target
    let new_data = {[name]: value}
    let formData = {...appData[`${page.data}`],...new_data}
    console.log({...appData,[`${page.data}`]:formData})
    setAppData({...appData,[`${page.data}`]:formData})
  }

  let userData = softwareUsers
  const handleUserInput = (e, index)=>{
    let {name, email} = userData[index]
    if(e.target.id.search("name")>0){
      name = e.target.value
    }else if(e.target.id.search("email")>0)(
      email = e.target.value
    )
    userData[index] =  {name, email}
    let request_details = {...appData.request_details,["software_users"]:userData}
    setAppData({...appData, request_details})
  }

  const handleSubmit = async (e)=>{
    
    e.preventDefault();
    const form = e.target

    if(e.nativeEvent.submitter.name==="backButton"){
      setFormClassList("form-group")
      let nextPage = pageList[pageList.length-2]
      console.log(nextPage)
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageList(pageList.splice(-1))
      setPageName(nextPage)

    }else{
        if(!form.checkValidity()){
          e.preventDefault();
        }else{

          let header_data = {
            subject: appData[`${page.data}`].subject,
            request_details: appData[`${page.data}`].details
          }
        
          let request_summary = {...appData.request_summary,...header_data}
          setAppData({...appData, request_summary})

          let nextPage = "Additional Info"
          setPage(pages.filter(x=>x.name===nextPage)[0])
          setPageList([...pageList,nextPage])
          setPageName(nextPage)
        }
        setFormClassList('form-group was-validated')
    }
}

const handleReset = ()=>{
  let formData={}
  setAppData({...appData, [`${page.data}`]:formData})
}

  const addIconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const removeIconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const addSupplier = () =>{
    setPage("Add Supplier")
  }

  const addProduct = () =>{
    setPage("Add Product")
  }


  const addUser = () =>{
    const newRow={name:"",email:""}
    setSoftwareUsers([...softwareUsers,newRow])
  }

  const removeUser = (e, index) =>{
    if(index>0){
      setSoftwareUsers(
        softwareUsers.filter(user => softwareUsers.indexOf(user) !== index)
      );
    }

  }

  useEffect(()=>{
    console.log(appData)
    console.log(page)
    console.log(pageList)

    getCategories()
  },[])

  const inputRequired = (index)=>{
    if(index==0){
      return {required: true}
    }
  }

  const addIcon = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons/add_icon.png"
  const removeIcon = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons/delete_icon.png"

  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  

  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
        <h1 className="text-left mb-3 border-bottom border-5">{pageName} Request</h1>
          
          <div className="d-flex flex-column bg-light border shadow p-3 rounded-2 justify-content-center">
          
          <form name='form' id="form" onSubmit={handleSubmit} className = "form-group" noValidate>
            
            <div className="form-floating mb-3">
              <input id = "subject" name= "subject" className="form-control form-control text-primary" onKeyUp={handleChange} placeholder="Provide a subject or headline for this request" required></input>
              <label htmlFor="subject" className="form-label text-body-tertiary small">Summarize what you need</label>
            </div>

            <div className="form-floating mb-3 has-validation">
              <select 
                id = "product" 
                name="product"
                className="form-select text-primary"
                placeholder = "Select a product that is needed" 
                onChange={handleChange}
                defaultValue=""
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {categories.map(item=>(
                  <option className="option light" key={categories.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="category" className="form-label text-body-tertiary">What software product do you need?</label>
              <div className="text-secondary small"><img src={addIcon} style={addIconStyle} onClick={(e)=>addProduct(e)}></img>Add product</div>
            </div>
            
            <div className="form-floating mb-3">
              <select 
                id = "supplier" 
                name = "supplier" 
                className="form-select text-primary" 
                placeholder="Select a preferred supplier for this purchase"
                onChange={handleChange} 
                defaultValue=""
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {businesses.map(item=>(
                  <option className="option light " key={businesses.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="supplier" className="form-label text-body-tertiary">Select a preferred supplier if known</label>
              <div className="text-secondary small"><img src={addIcon} style={addIconStyle} onClick={(e)=>addSupplier(e)}></img>Add supplier</div>
            </div>

            <div className="form-group mb-3">

             <h5>List the users that need access</h5>
              <table className="table w-100 border rounded rounded-2">
                <thead>
                  <tr className="text-center text-small">
                    <th>Full Name</th>
                    <th>Email</th>
                  </tr>
                  <tr className="table-group-divider"></tr>
                </thead>
                <tbody className="table-group-divider text-small">
                  {softwareUsers.map((user, index)=>(
                    <tr key={index} id={`user_${index}`} ref={usernameRefs.current[index]}>
                      <td><input id={`user_${softwareUsers.indexOf(user)}_name`} name={`user_${softwareUsers.indexOf(user)}_name`} className="form-control" onBlur={(e)=>handleUserInput(e, index)} placeholder={user.name} {...inputRequired(index)}></input></td>
                      <td><input id={`user_${softwareUsers.indexOf(user)}_email`} name={`user_${softwareUsers.indexOf(user)}_email`} className="form-control" type="email" onBlur={(e)=>handleUserInput(e, index)} placeholder={user.email} {...inputRequired(index)}></input></td>
                      <td id={`remove_user_${softwareUsers.indexOf(user)}`} className="small bg-second"><img src={removeIcon} style={removeIconStyle} onClick={(e)=>removeUser(e, index)}></img></td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" className="small bg-second" style={{background:"none"}}><img src={addIcon} style={addIconStyle} onClick={(e)=>addUser(e)}></img>Add user</td>
                  </tr>
                </tbody>
              </table>
            </div>

    
            <div className="d-flex justify-content-center">
              <div className="btn-group">
                <button name= "backButton" className="btn btn-outline-secondary w-25" data-bs-toggle="button">Back</button>
                <button name="nextButton" className="btn btn-primary w-25" data-bs-toggle="button" type="submit">Next</button>
              </div>
            </div>
          </form>

          </div>
        </div>
        
        <div className="col"></div> 
      </div>
    </div>
  )
}

export default NonStandard