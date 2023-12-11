import React, {useState, useEffect, useContext, useRef, createRef} from 'react'
import { Context } from "./Context.js"
import axios from './axios.js'
import "bootstrap/dist/css/bootstrap.min.css"

import 'animate.css';

const SoftwareAccess = () => {

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
    setRequestTypes,
    initialFormData,
    setInitialFormData
} = useContext(Context)

  let formData = {}
  const productRef = useRef()
  const supplierRef = useRef()

  const [productData, setProductData] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [currencySymbol, setCurrencySymbol] = useState("$")

  const [formClassList, setFormClassList] = useState("form-group")

  const [softwareUsers, setSoftwareUsers] = useState([
    {name: "", email:""},
    {name: "", email:""},
    {name: "", email:""}
  ])

  const initializeUsers = ()=>{
    console.log("initialize users check")
    let x = JSON.stringify(Object.values(appData))
    if(x.search("software_users")>0){
      console.log("software_users found")
      setSoftwareUsers(appData[page.data]["software_users"])
    }
  }

  const usernameRefs = useRef([]);
  usernameRefs.current = softwareUsers.map(
      (ref, index) =>   usernameRefs.current[index] = createRef(index)
    )


  const getProducts = async ()=>{
    const response = await axios.get('/db/table/products')
    const data = await response.data
    setProductData(data)

    let productSet = new Set()
      await data.forEach(item=>{
        productSet.add(item.product_name)
      })
      
      let productList = [...productSet]
      setProducts(productList.sort())

      let supplierSet = new Set()
      await data.forEach(item=>{
        supplierSet.add(item.supplier)
      })

      let supplierList = [...supplierSet]
      setSuppliers(supplierList.sort())
  }

  const handleChange = (e)=>{
    const {name, value} = e.target
    let new_data = {[name]: value}
    formData = {...appData[`${page.data}`],...new_data}
    setInitialFormData(formData)
    setAppData({...appData,[`${page.data}`]:formData})

    if(name=="product" && value !==""){

      const supplier = productData.filter(x=>x.product_name===value)[0].supplier
      console.log(supplier)

      let new_data = {["supplier"]: supplier}
      formData = {...appData[`${page.data}`],...new_data}
      setInitialFormData(formData)
      setAppData({...appData,[`${page.data}`]:formData})
    }
  }

  let userData = softwareUsers
  const handleUserInput = (e, index)=>{
    let {name, value} = e.target
    if(name.search("name")>0){
      name = "name"
    }else if(e.target.id.search("email")>0)(
      name = "email"
    )
    let new_data = {[name]: value}
    userData[index] =  {...userData[index],...new_data}
    console.log(userData)
    setSoftwareUsers(userData)
    let request_details = {...appData[`${page.data}`],["software_users"]:userData}
    setAppData({...appData, request_details})
  }

  const handleSubmit = async (e)=>{
    
    e.preventDefault();
    const form = e.target

    if(e.nativeEvent.submitter.name==="backButton"){
      setFormClassList("form-group")
      let pageListCopy = pageList
      let thisPage = pageListCopy.splice(-1)
      let nextPage = pageListCopy[pageListCopy.length-1]
      setPageList(pageListCopy)
      setPage(pages.filter(x=>x.name===nextPage)[0])
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
  formData={}
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
    let nextPage = "Add Business"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  const addProduct = () =>{
    let nextPage = "Add Product"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
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

    getProducts()
    initializeUsers()

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
              <input 
              id = "subject" 
              name= "subject" 
              className="form-control form-control text-primary" 
              onChange={handleChange} 
              placeholder="Provide a subject or headline for this request" 
              value={initialFormData.subject}
              required
              ></input>
              <label htmlFor="subject" className="form-label text-body-tertiary small">Summarize what you need</label>
            </div>

            <div className="form-floating mb-3 has-validation">
              <select 
                key={productRef}
                id = "product" 
                name="product"
                className="form-select text-primary"
                placeholder = "Select a product that is needed" 
                value={initialFormData.product}
                onChange={handleChange}
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {products.map(item=>(
                  <option className="option light" key={products.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="category" className="form-label text-body-tertiary">What software product do you need?</label>
              <div className="text-secondary small"><img src={addIcon} style={addIconStyle} onClick={(e)=>addProduct(e)}></img>Add product</div>
            </div>
            
            <div className="form-floating mb-3">
              <select 
                key={supplierRef}
                id = "supplier" 
                name = "supplier" 
                className="form-select text-primary" 
                placeholder="Select a preferred supplier for this purchase"
                value={initialFormData.supplier}
                onChange={handleChange} 
                defaultValue=""
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {suppliers.map(item=>(
                  <option className="option light " key={suppliers.indexOf(item)+1}>{item}</option>
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
                    <th></th>
                  </tr>
                  <tr className="table-group-divider"></tr>
                </thead>
                <tbody className="table-group-divider text-small">
                  {softwareUsers.map((user, index)=>(
                    <tr key={index} id={`user_${index}`} ref={usernameRefs.current[index]}>
                      <td><input id={`user_${index}_name`} name={`user_${index}_name`} className="form-control text-primary" onChange={(e)=>handleUserInput(e, index)} value={softwareUsers[index].name}{...inputRequired(index)}></input></td>
                      <td><input id={`user_${index}_email`} name={`user_${index}_email`} className="form-control text-primary" type="email" onChange={(e)=>handleUserInput(e, index)} value={softwareUsers[index].email} {...inputRequired(index)}></input></td>
                      <td id={`remove_user_${index}`} className="small bg-second"><img src={removeIcon} style={removeIconStyle} onClick={(e)=>removeUser(e, index)}></img></td>
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

export default SoftwareAccess