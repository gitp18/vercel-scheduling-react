import React, { useState, useEffect } from 'react';

function Product(pData) {
  return (
    <>
      <table>
        <thead>
          {
            <tr>
              {
                pData?.pData[0]?.map((item, i) => {
                  return <th key={'kp1-' + i}>{item}</th>
                })
              }
            </tr>
          }
        </thead>
        <tbody>
          {
            pData?.pData?.map((item, index) => {
              if (index === 0) return null;
              return (
                <tr key={'d' + index}>
                  {
                    item[0].map((tItem, tindex) => {
                      return <td key={'kp2-' + tindex}>{tItem}</td>
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
  </>
  );
}

export default Product;
