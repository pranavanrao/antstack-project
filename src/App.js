import logo from "./logo.svg";
import "./App.css";
import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import csvData from "./data.csv";

function App() {
  const [data, setData] = useState([]);
  const [ogData, setogData] = useState([]);
  useEffect(() => {
    d3.csv(csvData).then((d) => {
      setData(d);
      setogData(d);
    });
    return () => undefined;
  }, []);

  // console.log(ogData);

  const onFiltered = (value, accessor) => {
    let filtered = data;
    let filter1 = [];
    if (filtered.length) {
      filtered.forEach((record, i) => {
        if (value !== "" || value.length) {
          accessor === "deliveryPincode"
            ? record.deliveryPincode.includes(value) && filter1.push(record) && filter1.sort(
              (a, b) =>
                new Date(...a.orderDate.split("/").reverse()) -
                new Date(...b.orderDate.split("/").reverse())
            )
            : record.orderDate.includes(value) && filter1.push(record) && filter1.sort(
              (a, b) => (a.deliveryPincode > b.deliveryPincode) ? 1 : -1
            )
        } else filter1 = ogData;
      });
    }
    console.log(filter1);
    setData(filter1);
  };

  return (
    <div className="app">
      <div className="fields">
        <div className="field1">
          <span>Pin Code :</span>
          <input
            type="text"
            onChange={(event) =>
              onFiltered(event.target.value, "deliveryPincode" )
            }
          />
        </div>
        <div className="field2">
          <span>Date :</span>
          <input
            type="text"
            onChange={(event) =>
              onFiltered(event.target.value, "orderDate")
            }
          />
        </div>
      </div>
      <table>
        <tr>
          <th>Order Id</th>
          <th>Cust Id</th>
          <th>Pin Code</th>
          <th>Order Date</th>
          <th>Items</th>
        </tr>
        <tbody>
          {data.map((item) => {
            // console.log(item);
            const item1 = item.items
              .split(";")
              .filter((element) => element !== "");
            // console.log(item1);
            return (
              <tr>
                <td>{item.orderId}</td>
                <td>{item.customerId}</td>
                <td>{item.deliveryPincode}</td>
                <td>{item.orderDate}</td>
                <td>
                  {item1.map((element) => {
                    return (
                      <ul>
                        <li>{element}</li>
                      </ul>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
