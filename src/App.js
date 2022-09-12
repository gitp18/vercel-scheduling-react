import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import './App.css';

// GEKKO, decade, 




function App() {
  const [tableState, setTableState] = useState([[]]);
  const [inputSetFile, setInputSetFile] = useState('Inputset1.png');

  const getFirstRow = (str) => {
    var  days = 2;
    switch (str) {
      case '1':
        var days = 2;
        break;
      case '2':
        var days = 7;
        break;
      case '3':
        var days = 5;
        break;
      default:
        break;
    }
/*
      case '4':
        var days = 7;
        break;

*/

    let totShifts = (days * 3);
    let cols1 = new Array(totShifts+1).fill('');


    var res2 = [];
    var firstRow = cols1.map((d, i) => {
        if(i === 0)  res2[i] = "Machine/Shift";
        else {
          var d = '';
          if(i<4) d = 'Day1 - ';
          else if(i>2 && i<7) d = 'Day2 - ';
          else if(i>=7 && i<10) d = 'Day3 - ';
          else if(i>=10 && i<13) d = 'Day4 - ';
          else if(i>=13 && i<16) d = 'Day5 - ';
          else if(i>=16 && i<19) d = 'Day6 - ';
          else if(i>=18 && i<22) d = 'Day7 - ';
          else d = '';
  
          res2[i] = d+'S'+i;
      }
      return res2;
    });
    firstRow = firstRow[0];
    return firstRow;
  }


  const reformResArry = (arr, str) => {
    const firstRow = getFirstRow(str);
    const len = firstRow.length;
    let resArr = [];


    let rows = arr.map((d) => {
      const mName = getMachineName(d[0]);
      let nextRow = [mName];

      for(let i = 1; i < len; i++){
        var key = firstRow[i].split(' - ')[1];
        var cellVal = d[1][key];
        //cellVal = (parseInt(cellVal)) ? cellVal : '';
        //nextRow.push(cellVal);//nextRow = [...nextRow, cellVal];
        nextRow[i] = cellVal;
      }
      return nextRow;
    });
    rows.unshift([...firstRow]);
    setTableState([...rows]);
    //return rows;    
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let str = queryParams.get('Inputset');
    str = (str)?str:1; str = (str>3)?1:str;
    let inputSetFileName = str ? 'Inputset'+str+'.png' : 'Inputset1.png';
    setInputSetFile(inputSetFileName);


    const apiUrl = 'https://myuniquesolutions.pythonanywhere.com/pro/' + str;
    axios.get(apiUrl)
    .then(result => {
      if (result.status === 200) {
        return result.data;
      } else {
        return tableState;
      }
    }).then(result => {
      let resData = Object.entries(result);
      reformResArry(resData, str);

      //setTableState([...resData]);
      console.log(tableState);
    });




    /*const url = 'https://vercel-nodejs-two.vercel.app/api/user/scheduleData';
    //const str = url.split("/").pop(); const substr = 'Input'; let inputSetFile = (str.includes(substr))? str+'.png' : 'Inputset1.png';

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
    });*/
  }, []);

  const getMachineName = (keyId) => {
    const mId = keyId.split('-')[2];
    switch (mId) {
      case 'M1':
        return '800 T Buhler';
        break;
      case 'M2':
        return '1300 T Buhler';
        break;
      case 'M3':
        return '1400 T Buhler';
        break;
      case 'M4':
        return '650 T Buhler';
        break;
      default:
        break;
    }
  }


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
      <div className="row">
        <div className="col-md-12"><br /><br /><hr />
        </div>
      </div>
    </>
  );
}

export default App;
