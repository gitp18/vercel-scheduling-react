import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import './App.css';

// GEKKO, decade, 




function App() {
  const [tableState, setTableState] = useState([[]]);
  const [inputSetFile, setInputSetFile] = useState('Inputset1.png');


  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const str = queryParams.get('Inputset');
    let inputSetFileName = str ? 'Inputset'+str+'.png' : 'Inputset1.png';
    
    const apiUrl = 'https://myuniquesolutions.pythonanywhere.com/pro/1';
    axios.get(apiUrl)
    .then(result => {
      console.log(result);
      if (result.status === 200) {
      }
    });




    const url = 'https://vercel-nodejs-two.vercel.app/api/user/scheduleData';
    //const str = url.split("/").pop(); const substr = 'Input'; let inputSetFile = (str.includes(substr))? str+'.png' : 'Inputset1.png';

    setInputSetFile(inputSetFileName);
    axios.get(url)
    .then(result => {
      const selectedDay = "7DP1P2P3";

      if (result.status === 200) {
        let { displayData } = result.data;
        let selectedData = Object.entries(displayData);
        selectedData = selectedData.filter(item => item[0] == selectedDay)[0];
        let { tableData } = selectedData[1];
        setTableState([...tableData]);
        //console.log(tableState);
      }
    });
  }, []);


  return (
    <>
      <div className="row">
        <div className="col-md-6 d-flex">
            <img className="img-responsive img-fluid" src={'InputImage/Product/' + inputSetFile} alt={inputSetFile} />
        </div>
        <div className="col-md-6 alignRight">
            <img className="img-responsive img-fluid" src={'InputImage/Machine/' + inputSetFile} alt={inputSetFile} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12"><br /><br /><hr /><br /><br />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 App">
        <table>
            <thead>
              <tr>{ tableState[0]?.map(item => <th>{item}</th>) }</tr>
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
