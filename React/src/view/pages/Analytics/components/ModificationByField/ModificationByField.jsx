import React, { useEffect } from 'react';
import "./ModificationByField.css";
import { useState, useRef } from 'react';
import Select from "react-select"
import Chart from "../charts/Chart"
import { ServerStyleSheets } from '@material-ui/core';

//Server Filters to receive Data
let serverFilters = { fieldName: [], values: [], qaRepresentative: [], startDate: "", endDate: "", label: [] };
function ModificationByField(props) {
  //On Page Opening

  useEffect(() => {
    //Building Start and End date for last month (Default)
    let startDate = new Date();
    let endDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);
    let endMonth = endDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : endDate.getMonth() + 1;
    let startMonth = startDate.getMonth() + 1 < 10 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1;
    setStartDate(`${startDate.getFullYear()}-${startMonth}-${startDate.getDate()}`)
    setEndDate(`${endDate.getFullYear()}-${endMonth}-${endDate.getDate()}`)
    const timeZone = (startDate.getTimezoneOffset() / 60);
    startDate.setHours(0 - timeZone, 0, 0, 0);
    endDate.setHours(0 - timeZone + 23, 59, 59, 59);


    //Default Server Filters to receive Data
    serverFilters = {
      fieldName: [],
      values: [],
      qaRepresentative: [],
      startDate: (startDate),
      endDate: (endDate),
      label: ["weekly"]
    };

    //fetch to receive Available Filters options from server by date
    fetch('/api/analytics/modificationByFieldFilters', {
      method: 'POST',
      body: JSON.stringify({
        fieldName: serverFilters.fieldName,
        startDate: serverFilters.startDate,
        endDate: serverFilters.endDate
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setFieldNameOptions(data[0].labels);
          setQaRepresentativeOptions(data[0].QA);
        }
        else {
          alert("No Available Filters From The Server Check The connection / Change date")
        }
      })

    //fetch to receive Data (UiObj) from the server
    fetch('/api/analytics/modificationByField', {
      method: 'POST',
      body: JSON.stringify({ serverFilters }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data != null) {
          setUiObjs(data);
        }
        else { setUiObjs([]); }
      })
  }, [])

  //fetch to receive Data (UiObj) from server after every filter Change
  const render = (serverFilters) => {
    fetch('/api/analytics/modificationByField', {
      method: 'POST',
      body: JSON.stringify({ serverFilters }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data != null) {
          console.log(data)
          setUiObjs(data);
        }
        else {
          setUiObjs([]);
        }
      })
  }

  //fetch to get values after picking certain fieldName 
  const renderFilters = (serverFilters) => {
    fetch('/api/analytics/modificationByFieldFilters', {
      method: 'POST',
      body: JSON.stringify({ fieldName: serverFilters.fieldName }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data != null) {
          if (data.length > 0)
            // console.log(data)
            setValueOptions(data[0].Values);
          else {
            if (serverFilters.fieldName != "") {
              alert("No Available FieldName Values received From The Server (Check Coonection /Pick another fieldName)")
            }
            setValueOptions([]);
          }
        }
      })
  }

  //Modification By Field Variables
  const [UiObjs, setUiObjs] = useState([]); //UiObject from the server
  const [fieldNameOptions, setFieldNameOptions] = useState([]); //FieldName options for filtering
  const [valueOptions, setValueOptions] = useState([]);//Values of certain FieldName options for filtering
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [qaRepresentativeOptions, setQaRepresentativeOptions] = useState([]);//Qa Representative options for filtering
  const labelOptions = [ //Labels for Displaying the Chart 
    { value: "daily", label: "daily" },
    { value: "weekly", label: "weekly" },
    { value: "monthly", label: "monthly" },
    { value: "yearly", label: "yearly" }];


  //Filters Changes Handlers
  // for each Filter we have a handler
  // to update serverFilters that we send to server to receive data according to our picks

  //Label
  const handleChangeLabel = (change => {
    serverFilters.label = [change.value];
    render(serverFilters);
  })

  //Field Name
  const handleChangeFieldName = (change => {
    serverFilters.values = [];
    serverFilters.qaRepresentative = [];
    if (change != null) { serverFilters.fieldName = [change.value]; }
    else {
      serverFilters.fieldName = [];
      valueInput.current.state.value = "";
      qaInput.current.state.value = ""
    }
    render(serverFilters);
    renderFilters(serverFilters);
  })

  //Values
  const handleChangeValues = (change => {
    serverFilters.values = [];
    if (change != null) {
      change.map((item) => {
        let value = item.value;
        if (value == "true" || value == "false") {
          value = (value === 'true');

        }
        return (serverFilters.values.push(value))
      })     // change.map((item) => { })
    }
    else { serverFilters.values = []; }
    render(serverFilters);
  })

  //Qa Representative
  const handleChangeQaRepresentative = (change => {
    if (change != null) {
      serverFilters.qaRepresentative = [change.value];
    }
    else {
      serverFilters.qaRepresentative = []
    }
    render(serverFilters);
  })

  //Start Date
  const handleChangeStartDate = (change => {
    serverFilters.startDate = new Date(change.target.value);
    render(serverFilters);
  })
  //End Date
  const handleChangeEndDate = (change => {
    let endDate = new Date(change.target.value)
    const timeZone = (endDate.getTimezoneOffset() / 60);
    endDate.setHours((0 - timeZone) + (23), 59, 59, 59);
    serverFilters.endDate = endDate;
    render(serverFilters);
  })

  //We Use UseRef to clear other filters when we pick Main Filter
  const valueInput = useRef("")
  const qaInput = useRef("")


  return (
    <div className='ModificationByField__Wrapper'>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
      <div className="ModificationByField__Chart">
        {UiObjs && <Chart UiObjs={UiObjs}  />}
      </div>
      <div className="ModificationByField__MainTitle">Modification By Field</div>

      <div className="ModificationByField__Filters__wrapper">
        
        <div className="ModificationByField__Filters__fields">

          <div className="ModificationByField__Filters__Header">
          <p>Field Name</p>
          <Select
          name="fieldName"
          onInputChange={() => { valueInput.current.state.value = ""; qaInput.current.state.value = "" }}
          onChange={handleChangeFieldName}
          placeholder="All"
          className="ModificationByField__Filter"
          options={fieldNameOptions}
          isClearable={true} />
          </div>

          <div className="ModificationByField__Filters__Header">
          <p>Value</p>
          <Select
          name="value"
          onChange={handleChangeValues}
          ref={valueInput}
          isMulti
          placeholder="Value"
          className="ModificationByField__Filter"
          options={valueOptions} />
          </div>

          <div className="ModificationByField__Filters__Header">
          <p>Qa Representative</p>
          <Select
          name="qaRepresentative"
          ref={qaInput}
          onChange={handleChangeQaRepresentative}
          placeholder="QA Representative"
          className="ModificationByField__Filter"
          options={qaRepresentativeOptions}
          isClearable={true} />
          </div>
        
          <div className="ModificationByField__Filters__Header">
          <p>Start Date</p>
        <input
          className="ModificationByField__Filter__date"
          type="date"
          value={startDate}
          onChange={handleChangeStartDate}
        />
        </div>

        <div className="ModificationByField__Filters__Header">
          <p>End Date</p>
        <input
          className="ModificationByField__Filter__date"
          type="date"
          name="endDate"
          value={endDate}
          onChange={handleChangeEndDate}
        />
        </div>

        <div className="ModificationByField__Filters__Header">
          <p>Period</p>
        <Select
          name="label"
          onChange={handleChangeLabel}
          placeholder="Weekly"
          className="ModificationByField__Filter"
          options={labelOptions} />
          </div>
        </div>
      </div>
    </div>
  )

}


export default ModificationByField;



