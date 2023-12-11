import React, {useState, useContext, useEffect, useRef, createRef} from 'react';
import axios from './axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import {toProperCase} from "./formatValue.js"

const List = ({data}) => {

  const headers = Object.keys(data[0]);
  const [showRecord, setShowRecord] = useState(false)

  const dataRefs = useRef([]);
  dataRefs.current = headers.map(
      (ref, index) =>   dataRefs.current[index] = createRef(index)
    )


  const handleRecordSelect=()=>{
      setShowRecord(!showRecord)
    }

    const handleChange=()=>{
      
    }

const cardClassName="d-flex flex-column border border-1 rounded rounded-2 p-3 shadow-sm mb-2 bg-white" 
const tableClassNameStyle="table table-borderless p-0"
const tdClassName="p-0 m-0"

const [tdLabelStyle, settdlabelStyle]=useState({
  fontSize:12,
  color: "gray",
  width: "30%"
})


const [cardStyle, setCardStyle]=useState({
    fontSize: 12,
    backgroundColor: "white",
    height: 150,
    overflowY: "scroll"
})

const [tdValueStyle, settdValueStyle]=useState({
  fontSize:12
})

const styleLabel=(col, col_index, currentStyle)=>{
  if (col_index ==0){
    return {...currentStyle,...{fontSize: 18, fontWeight: 'bold', color: 'black'}}
  }
  if (col_index ==1){
    return {...currentStyle,...{fontSize: 16}}
  }
  if (col_index ==2){
      return {...currentStyle,...{fontWeight: 'bold'}}
  }else{
    return tdLabelStyle
  }
}

const styleValue=(col, value, col_index, currentStyle)=>{
  if (col_index ==0){
    return {...currentStyle,...{fontSize: 18, fontWeight: 'bold'}}
  }
  if (col_index ==1){
    return {...currentStyle,...{fontSize: 16}}
  }
  if (col_index ==2){
      return {...currentStyle,...{color: 'blue', fontWeight: 'bold'}}
  }
  if(value==="Open" && col==="status"){
      return {...currentStyle,...{color: 'green', fontWeight: 'bold'}}
  }
  if(value==="Closed" && col==="status"){
    return {...currentStyle,...{color: 'lightgray', fontWeight: 'bold'}}
}
if(value==="Approved" && col==="stage"){
  return {...currentStyle,...{color: 'green', fontWeight: 'bold'}}
}
if(value==="Denied" && col==="stage"){
  return {...currentStyle,...{color: 'red', fontWeight: 'bold'}}
}
if(value==="Hold" && col==="stage"){
  return {...currentStyle,...{color: 'orange', fontWeight: 'bold'}}
}

if(value==="Reviewing" && col==="stage"){
  return {...currentStyle,...{color: 'steelblue', fontWeight: 'bold'}}
}

  else{
    return tdValueStyle
  }
}

useEffect(()=>{
},[])
  
return (
  <div>
      {
          data.map((row,row_index)=>(
          <div className={cardClassName} style={cardStyle} key={row_index} id={row.id} name={row.id} onClick={handleRecordSelect}>
            <table className={tableClassNameStyle}>
              <tbody>
              {
                Object.keys(row).map((col,col_index)=>(
                  <tr key={col_index}>
                      <td ref={dataRefs[`${col}_${col_index}_label`]} className={tdClassName} style={styleLabel(col, col_index,tdLabelStyle)} htmlFor={col}>{toProperCase(col.replaceAll("_"," "))}: </td>
                      <td ref={dataRefs[`${col}_${col_index}_value`]} className={tdClassName} style={styleValue(col, row[col], col_index,tdValueStyle)}>{row[col]}</td>
                  </tr>
                ))
                }
                </tbody>
            </table>
              
          </div>
          ))
      }
      </div>
  )
}

export default List