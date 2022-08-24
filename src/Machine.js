import React, { useState, useEffect } from 'react';

function Machine(mData) {
  //console.log(mData);
  return (
    <>
        <table>
          <thead>
            {
              <tr>
                {
                  mData?.mData[0]?.map((item, i) => {
                    return <th key={'km1-' + i}>{item}</th>
                  })
                }
              </tr>
            }
          </thead>
          <tbody>
            {
              mData?.mData?.map((item, index) => {
                if (index === 0) return null;
                return (
                  <tr key={'d' + index}>
                    {
                      item[0].map((tItem, tindex) => {
                        return <td key={'km2-' + tindex}>{tItem}</td>
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

export default Machine;
