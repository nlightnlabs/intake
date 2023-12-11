import React, {useState, useEffect, useContext, useRef} from 'react'
import { Context } from "./Context.js"
import axios from './axios.js'
import "bootstrap/dist/css/bootstrap.min.css"

import 'animate.css';

const HRSupport = () => {

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

  let formData = appData

  const [categoryData, setCategoryData] = useState([])
  const [categories, setCategories] = useState([])
  const [businessData, setBusinessData] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [currencySymbol, setCurrencySymbol] = useState("$")
  const [files, setFiles] = useState(null)
  const [formClassList, setFormClassList] = useState("form-group")

  const formRef = useRef()
  const categoryRef = useRef()

  const getCategories = async ()=>{
    const response = await axios.get("/db/table/hr_support_types")
    const data = await response.data
    setCategoryData(data)

    let categorySet = new Set()
    
      await data.forEach(item=>{
        categorySet.add(item.support_category)
      })
      
      let categoryList = [...categorySet]
      setCategories(categoryList)
  }

  const handleChange = (e)=>{

      const {name, value} = e.target
      let new_data = {[name]: value}
      formData = {...appData[`${page.data}`],...new_data}
      setInitialFormData(formData)
      setAppData({...appData,[`${page.data}`]:formData})
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

  const addIcon = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons/add_icon.png"

  const iconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const addSupplier = ()=>{
    let nextPage = "Add Business"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  useEffect(()=>{
    console.log(appData)
    console.log(page)
    console.log(pageList)
    getCategories()
  },[])


  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  

  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
          <h1 className="text-left mb-3 border-bottom border-5">{pageName} Request</h1>
          
          <div className="d-flex flex-column bg-light border shadow shadow p-3 rounded-2 justify-content-center">
          
          <form ref={formRef} name='form' id="form" onSubmit={handleSubmit} className={formClassList} noValidate>
            
            <div className="form-floating mb-3">
              <input id = "subject" name= "subject" className="form-control form-control text-primary" value={initialFormData.subject} onChange={handleChange} placeholder="Provide a subject or headline for this request" required></input>
              <label htmlFor="subject" className="form-label text-body-tertiary small">Summarize what you need</label>
            </div>
            
            <div className="form-floating mb-3 has-validation">
              <select
                ref={categoryRef}
                id = "hr_support_type" 
                name="hr_support_type"
                className="form-select text-primary"
                placeholder = "Select type of support you need" 
                value={initialFormData.hr_support_type}
                onChange={handleChange}
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {categories.map(item=>(
                  <option className="option light" key={categories.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="category" className="form-label text-body-tertiary">Select type of support you need</label>
            </div>
            
            
            <div className="form-floating mb-3">
              <textarea 
                id="details" 
                name="details" 
                className="form-control form-control text-primary" 
                rows="5" style={{height:"100%"}} 
                onChange={handleChange}
                value={initialFormData.details}
                placeholder="Describe what you need in detail" 
                required>
              </textarea>
              <label htmlFor="details" className="form-label text-body-tertiary small">Describe what you need in detail</label>
            </div>
    
            <div className="d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-center">
                <div className="btn-group">
                  <button name= "backButton" className="btn btn-outline-secondary" data-bs-toggle="button">Back</button>
                  <button name="nextButton" className="btn btn-primary" data-bs-toggle="button" type="submit">Next</button>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-light text-center mt-1 text-body-secondary d-block" style={{cursor: "pointer"}} onClick={handleReset}>Reset</button>
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

export default HRSupport