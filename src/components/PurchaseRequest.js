import React, {useState, useEffect, useContext, useRef} from 'react'
import { Context } from "./Context.js"
import axios from './axios.js'
import "bootstrap/dist/css/bootstrap.min.css"

import 'animate.css';

const PurchaseRequest = () => {

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

  const getBusinessData = async ()=>{
    const response = await axios.get("/db/table/businesses")
    const data = await response.data
    setBusinessData(data)

    let businessseSet = new Set()
    
      await data.forEach(item=>{
        businessseSet.add(item.name)
      })
      
      let businessList = [...businessseSet]
      setBusinesses(businessList.sort())
  }

  const getCategories = async ()=>{
    const response = await axios.get("/db/table/spend_categories")
    const data = await response.data
    setCategoryData(data)

    let categorySet = new Set()
    
      await data.forEach(item=>{
        categorySet.add(item.category)
      })
      
      let categoryList = [...categorySet]
      setCategories(categoryList.sort())
  }

  const getSubcategories = async (category)=>{
    const response = await axios.get(`/db/subList/spend_categories/subcategory/category/${category}`)
    const data = await response.data

    let subcategorySet = new Set()
    await data.forEach(item=>{
      subcategorySet.add(item)
    })

    let subcategoryList = [...subcategorySet]
    setSubcategories(subcategoryList.sort())
  }

  const handleChange = (e)=>{

      const {name, value} = e.target
      let new_data = {[name]: value}
      formData = {...appData[`${page.data}`],...new_data}
      setInitialFormData(formData)
      setAppData({...appData,[`${page.data}`]:formData})

      if(name=="category" && categoryRef.current.value !==""){
        const category = categoryRef.current.value
        getSubcategories(category)
      }
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

    getBusinessData()
    getCategories()
  },[])


  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  

  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
          <h1 className="text-left mb-3 border-bottom border-5">{pageName}</h1>
          
          <div className="d-flex flex-column bg-light border shadow shadow p-3 rounded-2 justify-content-center">
          
          <form ref={formRef} name='form' id="form" onSubmit={handleSubmit} className={formClassList} noValidate>
            
            <div className="form-floating mb-3">
              <input id = "subject" name= "subject" className="form-control form-control text-primary" value={initialFormData.subject} onChange={handleChange} placeholder="Provide a subject or headline for this request" required></input>
              <label htmlFor="subject" className="form-label text-body-tertiary small">Summarize what you need</label>
            </div>
            
            <div className="form-floating mb-3">
              <select 
                id = "supplier" 
                name = "supplier" 
                className="form-select text-primary" 
                placeholder="Select a preferred supplier for this purchase"
                value={initialFormData.supplier}
                onChange={handleChange} 
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {businesses.map(item=>(
                  <option className="option light" key={businesses.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="supplier" className="form-label text-body-tertiary">Select a preferred supplier if known</label>
              <div className="text-secondary small"><img src={addIcon} style={iconStyle} onClick={(e)=>addSupplier(e)}></img>Add supplier</div>
              
            </div>

            <div className="form-floating mb-3 has-validation">
              <select
                ref={categoryRef}
                id = "category" 
                name="category"
                className="form-select text-primary"
                placeholder = "Select spend category" 
                value={initialFormData.category}
                onChange={handleChange}
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {categories.map(item=>(
                  <option className="option light" key={categories.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="category" className="form-label text-body-tertiary">Select spend category</label>
            </div>

            {subcategories.length>0 &&
              <div className="form-floating mb-3 has-validation animate__animated animate__slideInDown animate__duration-0.5s">
                <select 
                  id = "subcategory" 
                  name="subcategory"
                  className="form-select text-primary"
                  placeholder = "Select spend subcategory" 
                  value={initialFormData.subcategory}
                  onChange={handleChange}
                  required
                  >
                  <option value="" style={{color: "lightgray"}}></option>
                  {subcategories.map(item=>(
                    <option className="option light" key={subcategories.indexOf(item)+1}>{item}</option>
                  ))}
                </select>
                <label htmlFor="subcategory" className="form-label text-body-tertiary">Select spend subcategory</label>
              </div>
            }
            
            
            <div className="form-floating mb-3">
              <textarea 
                id="details" 
                name="details" 
                className="form-control form-control text-primary" 
                rows="5" style={{height:"100%"}} 
                onChange={handleChange}
                value={initialFormData.details}
                placeholder="Please provide specific details for your request" 
                required>
              </textarea>
              <label htmlFor="details" className="form-label text-body-tertiary small">Describe what you need in detail</label>
            </div>

            <div className="input-group mb-3">
                <div className="input-group-text">{currencySymbol}</div>
                  <div className="form-floating">
                  <input id = "amount" name="amount" className="form-control text-primary" type = "number" value={initialFormData.amount} placeholder="Provide an estimated total cost if known" onChange={handleChange}></input>
                  <label htmlFor="amount" className="form-label text-body-tertiary small">Provide an estimated amount if known</label>
               </div>
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

export default PurchaseRequest