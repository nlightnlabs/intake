import React, {useState, useRef, createRef, useEffect} from 'react'

const Table = ({data, setData}) => {

  const headers= Object.keys(data[0])

  const handleCellChange = (e, row_index)=>{
    const {id,name, value} = e.target
    let new_value = {[name]: value}
    let new_row = {...data[row_index],...new_value}
    let new_data = data
    new_data[row_index] = new_row
    setData([...data,new_data])
  }

  const calculate=(e,row_index, col_index)=>{
    let {id,name, value} = e.target
    if(value.toString().slice(0,1)=="="){
      try {
        value = eval(value.toString().slice(1))
        let new_value = {[name]: value}
        let new_row = {...data[row_index],...new_value}
        let new_data = data
        new_data[row_index] = new_row
        setData([...data,new_data])
      } catch (error) {
        setData(data)
      }
    }
  }

  const handleClick = (e, row_index)=>{
    console.log(data[row_index])
  }

  const cellProps = {readOnly : true, disabled: true}


  const tableStyles=`
    .table-container {
      max-height: 100%; 
      overflow: auto; 
      min-width: max-content
    }
    
    .std-table {
      width: 100%;
      border-collapse: collapse;
    }
     
    .std-table th,
    .std-table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd; /* Add bottom border for cells */
    }
    
    .std-table tbody tr:nth-child(even) {
      background-color: rgb(250,250,250) /* Alternate row background color */
    }
  
    .std-table tbody tr:hover {
      background-color: rgb(235,245,255)
    }
  
    .std-table th{
      position: sticky;
      top:0;
      background-color: white;
      padding: 0;
      padding-top: 5px;
    }
  
    .divider{
      display: block;
      width: 100%;
      height: 4px;
      background-color: gray;
    }
  
    .th-label{
      padding: 10px
    }
  
    .std-table input{
      border: none;
      background: none;
    }
  }`


  return (
    <div className="table-container">
      
      <table className="std-table">
        <thead>
          <tr >{headers.map((col,index)=>(<th key={index}>
            <label className="th-label">{col}</label>
            <div className="divider"></div></th>))}</tr>
        </thead>
        <tbody>
          {
            data.map((row,row_index)=>(
              <tr style={{zIndex: 10}} key={row_index} onClick={(e)=>handleClick(e, row_index)}>{headers.map((col,col_index)=>(
              <td key={col_index} onClick={(e)=>handleClick(e, row_index)}>
                <input 
                  id={`R${row_index+1}C${col_index}`} 
                  name={col} value={row[col]} 
                  onChange={(e)=>handleCellChange(e, row_index)} 
                  onBlur={e=>{calculate(e, row_index, col_index)}}
                  {...cellProps}
                  ></input>
              </td>))}
              </tr>
            ))
          }
        </tbody>
      </table>
      <style>{tableStyles}</style>
    </div>
  )
}

export default Table