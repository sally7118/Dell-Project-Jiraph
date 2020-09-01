import React from 'react';
import "./DelaysInDelivery.css";
import Select from 'react-select'
import { useState, useEffect } from 'react';

const serverFilters = {
  fixVersion: [],
  jiraType: [],
  qaRepresentative: [],
  startDate: "",
  endDate: "",
  label: ["weekly"]
};

function DelaysInDelivery() {


  // const [UiObjs, setUiObjs] = useState([]);

  // Options To get From Server 
  const [fixVersionOptions, setfixVersionOptions] = useState([])
  const [jiraTypeOptions, setJiraTypeOptions] = useState([])
  const [qaRepresentativeOptions, setQaRepresentativeOptions] = useState([])

  const [labelOptions, setLabelOptions] = useState([
    { name: "label", value: "daily", label: "Daily" },
    { name: "label", value: "weekly", label: "Weekly" },
    { name: "label", value: "monthly", label: "Monthly" },
    { name: "label", value: "yearly", label: "Yearly" }
  ])

  // Functions ==> Fetch : 
  const render = (serverFilters) => {
    fetch('api/analytics/filters/delaysInDelivery', {
      method: 'POST',
      body: JSON.stringify(serverFilters),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => { console.log(data) })

  }

  useEffect(() => {
    fetch('api/analytics/delaysInDeliveryFilters', {
      method: 'POST',
      body: JSON.stringify(serverFilters),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setfixVersionOptions(data[0].fixVersion)

      })
    })

    const renderFilters = (serverFilters) => {
      fetch('api/analytics/delaysInDeliveryFilters', {
        method: 'POST',
        body: JSON.stringify(serverFilters),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((res) => res.json())
        .then((data) => { 
          setJiraTypeOptions(data[0].Jira);
          setQaRepresentativeOptions(data[0].QA); 
        })
  
    }



    const HandlefixVersionChange = (version => {
      serverFilters.fixVersion=[version.value];
       
        render(serverFilters)
        renderFilters(serverFilters);
      })

  const HandlejiraTypeChange = (type => {
    serverFilters.jiraType=[]
    if(type!=null){
      type.map((item, index) => {
        return serverFilters.jiraType.push(item.value)
      })}
      else {
        serverFilters.jiraType=[]
      }
    render(serverFilters);
  })

  const HandleqaRepresentativeChange = (Qa => {
    serverFilters.qaRepresentative = []
    if(Qa!=null){
    Qa.map((item, index) => {
      return serverFilters.qaRepresentative.push(item.value)
    })}
    else {
      serverFilters.qaRepresentative=[]
    }

    render(serverFilters);
  })


  const HandleStartDateChange = (date => {
    serverFilters.startDate = (date.target.value);
    render(serverFilters);
  })
  const HandleEndDateChange = (date => {
    serverFilters.endDate = (date.target.value);
    render(serverFilters);
  })
  const HandleLabelChange = (label => {
    serverFilters.label = [label.label];
    render(serverFilters);
  })

  return (

    <div className='DelaysInDeliveryWrapper'>
      <div className="DelaysInDelivery__Title">Delays in Delivery</div>

      {/* Select Filters */}

      <form className="DelaysInDelivery__Filters">

        <Select
          name="fixVersion"
          options={fixVersionOptions}
          placeholder="fix Version "
          className="DelaysInDelivery__Filter"
          onChange={HandlefixVersionChange}

        />

        <Select
          name="jiraType"
          isMulti
          options={jiraTypeOptions}
          placeholder="jira Type  "
          className="DelaysInDelivery__Filter"
          onChange={HandlejiraTypeChange}
        />

        <Select
          name="qaRepresentative"
          isMulti
          options={qaRepresentativeOptions}
          placeholder="Qa Representative "
          className="DelaysInDelivery__Filter"
          onChange={HandleqaRepresentativeChange}
        />

        <input
          className="DelaysInDelivery__Filter"
          type="date"
          name="startDate"
          onChange={HandleStartDateChange}
        />

        <input
          className="DelaysInDelivery__Filter"
          type="date"
          name="endDate"
          onChange={HandleEndDateChange}
        />

        <Select
          name="labels"
          options={labelOptions}
          placeholder="Label"
          className="DelaysInDelivery__Filter"
          onChange={HandleLabelChange}
        />

      </form>
    </div>
  )

}


export default DelaysInDelivery;