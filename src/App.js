import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import './App.css';

// GEKKO, decade, 

function App() {
  const [tableState, setTableState] = useState([[]]);





  useEffect(() => {
    const url = 'https://vercel-nodejs-two.vercel.app/api/user/scheduleData';
    const str = url.split("/").pop(); const substr = 'Input'; 
    let inputSetFile = (str.includes(substr))? str+'.png' : 'Inputset1.png';
    

  axios.get(url)
    .then(result => {
      const selectedDay = "7DP1P2P3";

      if (result.status === 200) {
        let { days, displayData, products } = result.data;
        let selectedData = Object.entries(displayData);
        selectedData = selectedData.filter(item => item[0] == selectedDay)[0];
        let { productData, machineData, tableData } = selectedData[1];
        setTableState([...tableData]);
        //console.log(tableState);
      }
    });
  }, []);


  return (
    <>
      <div className="row">
        <div className="col-md-12 App">
            <img src="InputImage/Inputset1.png" alt="Inputset1" />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 App">
        <table>
            <thead>
            <tr>
                {
                tableState[0]?.map(item => <th>{item}</th>)
                }
            </tr>
            </thead>
            <tbody>
            {
                tableState.map((item, index) => {
                if (index === 0) return null;
                return (
                    <tr key={'d' + index}>
                    {
                        item.map((tItem, tindex) => {
                        return <td key={tindex} className={'P-' + tItem}>{tItem}</td>
                        })
                    }
                    </tr>
                )
                })
            }
            </tbody>
        </table>
        </div>
      </div>
    </>
  );
}

export default App;
