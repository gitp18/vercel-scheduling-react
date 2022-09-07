import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import Product from './Product';
import Machine from './Machine';

// GEKKO, decade, 

function App() {
  const [productData, setProductData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [tableState, setTableState] = useState({
    days: [],
    products: [],
    displayData: [],
    displayProducts: [],
    selectedDay: "",
    selectedProduct: [],
    selectedData: []
  });

  /* ================    All the Coding Logic / algorithms related to Product loading - start  ================== */
  const [recentProductOnMachine, setRecentProductOnMachine] = useState([]);
  const [productDimensions, setProductDimensions] = useState([]);
  const [resultArr, setResultArr] = useState([]);
  const [productLoadedFlag, setProductLoadedFlag] = useState([false, '']);

  const mainFunc = (selectedData) => {
    console.table(resultArr);
    console.table(productDimensions);
    console.table(recentProductOnMachine);
  
    var c = resultArr.map((rowData, row) => {
      rowData.map((colData, col) => {
        if(row > 0 && col > 0) {

          /* Check if this cell is empty or has a product */
          /* if NOT empty then skip and move to the next cell! If empty then do the below */
          const empty = isCellEmpty(row, col);
          if(empty){

            const mIndex = machineData.findIndex(p => {return p[0][0] === rowData[0]});
            const mData =  machineData[mIndex];
            
            productData.map((d, productIndex) => {
              if(productIndex > 0) {

                let pI = productDimensions.findIndex(p => p[0].name === d[0][0]);
                let pData = productDimensions[pI];

                /* Check if this particular product has already reached the targeted demand or not! */
                const eligible = checkLoadingEligibility(pData);
                if(eligible){
                  loadThisProduct(pData[0].name, row, col, mData, pData[0]);
                }
              }  
            })
          }
        }
      });
    });
    

    //console.table(resultArr); //setResultArr(resultArr);
    //console.table(machineData);
    //console.table(productData);
    //console.table(productDimensions);
    //console.table(recentProductOnMachine);
  }

  const loadThisProduct = (productId, row=2, col=2, mData, pData) => {
    //alert(111);
    //console.log(mData, '00000')
    /* 1. Get the result array and Update the cell with the productId received */
    const specifucRow = [...resultArr[row]];
    if(specifucRow[col] == ''){
      specifucRow[col] = productId;
      setProductLoadedFlag([true, productId]);
    }
    resultArr[row] = [...specifucRow];

    //console.log(productLoadedFlag, '&&&&');
    if(productLoadedFlag[0]) {
      //updateProductData(pData, productLoadedFlag[1], mData.ProductionPershift);
      //updateMachineData(mData, productLoadedFlag[1]);
    }
  }


  /* 2. Update Machine Data */
  const updateMachineData = (mData, productId) => {
    //alert(2222);
    //let mData = mData[0];
    //console.log(mData, '--xxxx---', productId);
    
    const index = recentProductOnMachine.findIndex(p => {return p.name === mData.name});
    if(index != -1){
      //console.log(mData);//.name, '---', index, '----', recentProductOnMachine, recentProductOnMachine[index]);
      const arr = [...recentProductOnMachine[index]];

      let changeOver = arr.changeOver;

      // Check what is that recent most product was loaded before, on this same Machine */
      if(arr.recentProductId === '') { // No product was there => "No changeOver"
        changeOver = changeOver;
      } 

      // You're having the "Product Id" of the recent most product that was loaded before, on this machine */
      else { 

        /* check if recent product loaded on this machine is the same as the current product in the possible product list */
        changeOver = (arr.recentProductId === productId) ? changeOver : parseInt(changeOver) + 1;
      }


      arr.changeOver = changeOver;//parseInt(arr.changeOver) + 1;
      arr.recentProductId = productId;

      recentProductOnMachine[index] = [...arr];
      //console.table(recentProductOnMachine);
      //setRecentProductOnMachine(recentProductOnMachine);
    }
  }

  /* 3. Update product.produced, shiftsRemained */
  const updateProductData = (pData, productId, ProductionPershift) => {
    //console.log(pData);
    /*const index = productDimensions.findIndex(p => {return p.name === pData.name})
    const arr = [...productDimensions[index]];

    pData.shiftItsRemained = parseInt(pData.shiftItsRemained) - 1;
    pData.produced = parseInt(pData.produced) + parseInt(ProductionPershift);

    productDimensions[index] = [...arr];

    //setProductDimensions(pData);*/
  }

  
  const blankResultArray = (days = 3, machines = ['M1', 'M2', 'M3']) => {
    let totShifts = (days * 3); let totMachines = machines.length;

    const rows = new Array(totMachines).fill('');
    let cols = new Array(totShifts).fill('');
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
    var res = rows.map((d, i) => ['M'+(parseInt(i)+1), ...cols]);
    var res3 = [firstRow, ...res];
    //console.table(res3)
    return res3;
  }
  const checkLoadingEligibility = (pData) => {
    //console.log(pData, '222222222222222');
    /* If product has not reached the targeted demand && shifts are remained */
    return (pData[0].produced < pData[0].demand && pData[0].shiftItsRemained > 0) ? true : false;
  }
  const isCellEmpty = (row=2, col=2) => {
    return (resultArr[row][col] === '') ? true : false;
  }
  /* ================    All the Coding Logic / algorithms related to Product loading - end  ================== */





  useEffect(() => {
    axios.get('https://vercel-nodejs-two.vercel.app/api/user/scheduleData')
    /*.then(result => {
      //return result.json()
      JSON.parse(result)
    })*/
    .then(result => {
      if (result.status === 200) {
        let { days, displayData, products } = result.data;
        setTableState({
          ...tableState,
          days: Object.entries(days),
          products: Object.entries(products),
          displayData: Object.entries(displayData)
        });
      }
    });
  }, []);

  const onChangeHandler = (e) => {
    setProductData([]);
    setMachineData([]);

    let selectedDay = e.target.value;
    if(selectedDay === ''){ 
      setTableState({
        ...tableState,
        selectedProduct: []
      });
      setResultArr([]);
      alert('Please select a valid data!');
    } else {
      let product = tableState.products.filter(([key]) => key === selectedDay)[0];
      setTableState({
        ...tableState,
        selectedDay: selectedDay,
        displayProducts: product[1],
        selectedProduct: []
      });
    }
  }
  function removeDuplicateObjectFromArray(array, key) {
    var check = new Set();
    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
    //removeDuplicateObjectFromArray(mRes, 'name');
  }
  const findInputs = (selectedDay, selectProduct, allProducts) => {
    let selectedData = tableState.displayData.filter(item => item[0] == selectedDay + allProducts.join(''))[0];

    const machines = tableState.products.filter(i=>i[0]==selectedDay)[0][1].filter(item => item.name == selectProduct)[0];
    let mRes = []; let pRes = [];

    if(selectedData){
      /* Code to present the Input @ right side */
      mRes = selectedData[1].machineData.map((data) => {
        var res = []; 
        res = [...res, [data.name, data.ProductionPershift, data.TotalMachineCounts]]; 
        return res;
      });
      mRes.unshift(['Machines', 'Product per Shift', 'Machine Counts']);
      setMachineData(mRes);

      pRes = selectedData[1].productData.map((data) =>{
        const machines = tableState.products.filter(i=>i[0]==selectedDay)[0][1].filter(item => item.name == data.name)[0];
        var res = []; 
        res = [...res, [data.name, machines.machines.join(' & '), data.shifts, data.demand, data.die, data.inventory]]; 
        return res;
      });
      pRes.unshift(['Product Name', 'Machines', 'Shift', 'Demand', 'Die', 'Dispatch Per Shift']);
      setProductData(pRes);



      /* Code to set initial dimensions for the calculation */
      var p = selectedData[1].productData.map((data) => {
        var res = []; 
        res = [...res, { ...data, 'shiftItsRemained': data.shifts, 'produced': 0}]; 
        return res;
      });
      setProductDimensions(p);
      var m = selectedData[1].machineData.map((data) => {
        var res = []; 
        res = [...res, {...data, 'recentProductId': '', 'changeOver': 0}]; 
        return res;
      });
      setRecentProductOnMachine(m);
    } else {
      //setProductData([]); setMachineData([]);
      //setProductDimensions([]); setRecentProductOnMachine([]);
    }
  }
  const onClickHandler = (e, selectedDay) => {
    let selectProduct = e.target.value;
    let allProducts = tableState?.selectedProduct;

    if (e.target.checked) {
      allProducts = [...allProducts, selectProduct];
      setTableState({
        ...tableState,
        selectedProduct: allProducts
      });

      /* Code to show submit button */

      /* Code to present the Input @ right side */
      findInputs(selectedDay, selectProduct, allProducts);
    } else {
      let filterData = tableState.selectedProduct.filter(item => item !== selectProduct);
      setTableState({
        ...tableState,
        selectedProduct: filterData
      });
    }
  }

  const onSubmitHandler = () => {
    let { displayData, selectedDay, selectedProduct } = tableState;
    let selectedData = displayData.filter(item => item[0] == selectedDay + selectedProduct.join(''))[0];
    
    setTableState({
      ...tableState,
      selectedData: selectedData[1].tableData
    });

    /* Create the empty result array */
    let arr = []; 
    let days = parseInt(selectedDay.split("D")[0]);
    let machines = selectedData[1].machineData;
    arr = blankResultArray(days, machines);
    setResultArr(arr);

    /* Load products */
    mainFunc(selectedData);
  }

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <div className="row">
            <div className="col-md-5">Schedule for</div>
            <div className="col-md-7">
              <select onChange={(e) => onChangeHandler(e)}>
              <option value="">Select Days</option>
              {
                tableState.days.map(([firstItem, secondItem], index) => {
                  return (
                    <option key={'k1-'+index} value={firstItem + ''}>{secondItem + ' days'}</option>
                  )
                })
              }
              </select>
            </div>
          </div>
          <div className="row">
          <div className="col-md-5">Select products</div>
          <div className="col-md-7">
            {
              tableState?.displayProducts?.map((item, index) => {
                return (<>
                  <span key={"product" + item.name}>
                    <input type={'checkbox'} name={"product" + index} checked={tableState.selectedProduct.includes(item.name)} onChange={(e) => onClickHandler(e, tableState.selectedDay)} value={item.name} />
                    <label forhtml={"product" + index} className={'P-' + item.name}>{item.name}</label>
                  </span>
                </>)
              })
            }
          </div>
          </div>
        </div>
        <div className="col-md-5 App">
          <Product pData = {productData} />
        </div>
        <div className="col-md-4 App">
          <Machine mData = {machineData} />    
        </div>
      </div>

      <br />
      <button type={'button'} onClick={onSubmitHandler}>Load Products</button>
      
      <div className="row">
        <div className="col-md-12 App">
          <table>
            <thead>
              <tr>
                {
                  tableState?.selectedData[0]?.map(item => <th>{item}</th>)
                }
              </tr>
            </thead>
            <tbody>
              {
                tableState.selectedData.map((item, index) => {
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
