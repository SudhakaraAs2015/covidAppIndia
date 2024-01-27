import React, {useEffect, useState } from 'react'
import Axios from 'axios'

function CovidApp() {
  const statesList = [
    "Please Select State",
    "TT - Tripura",
    "AN - Andaman and Nicobar Islands",
    "AP - Andhra Pradesh",
    "AR - Arunachal Pradesh",
    "AS - Assam",
    "BR - Bihar",
    "CH - Chandigarh",
    "CT - Chhattisgarh",
    "DN - Daman and Diu",
    "DD - Dadra and Nagar Haveli",
    "DL - Delhi",
    "GA - Goa",
    "GJ - Gujarat",
    "HR - Haryana",
    "HP - Himachal Pradesh",
    "JK - Jammu and Kashmir",
    "JH - Jharkhand",
    "KA - Karnataka",
    "KL - Kerala",
    "LA - Ladakh",
    "LD - Lakshadweep",
    "MP - Madhya Pradesh",
    "MH - Maharashtra",
    "MN - Manipur",
    "ML - Meghalaya",
    "MZ - Mizoram",
    "NL - Nagaland",
    "OR - Odisha",
    "PY - Puducherry",
    "PB - Punjab",
    "RJ - Rajasthan",
    "SK - Sikkim",
    "TN - Tamil Nadu",
    "TG - Telangana",
    "TR - Tripura",
    "UP - Uttar Pradesh",
    "UT - Uttarakhand",
    "WB - West Bengal",
  ];
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDDCode, setSelectedDDCode] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [responseData, setResponseData] = useState("");
  const [totalCases, setTotalCases] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const onReset = () => {
    setSelectedOption("");
    setSelectedDDCode("");
    setEnteredDate("");
    setTotalCases("");
    setErrorMsg("");
  };

  const dateChangeHandler = (event) => {
    setTotalCases("");
    setErrorMsg("");
    setEnteredDate(event.target.value);
  };

  const handleSelectChange = (event) => {
    setTotalCases("");
    setErrorMsg("");
    const value = event.target.value;
    setSelectedOption(value);
    console.log(value);//HR - Haryana
    // ['HR ', ' Haryana']
    // HR 
    //  HR
    console.log(value.split("-"));
    console.log(value.split("-")[0]);
    console.log(value.split("-")[0].trim());
    setSelectedDDCode(value.split("-")[0].trim());
  };

  const submitBtnHandler = () => {
    setTotalCases("");
    setErrorMsg("");
    console.log(enteredDate);
    if (!enteredDate && !selectedOption) {
      setErrorMsg("Please Enter Date or Select State");
      return;
    } else if (!enteredDate) {
      setErrorMsg("Please Enter Date");
      return;
    } else if (!selectedOption) {
      setErrorMsg("Please Select State");
      return;
    }
    Axios
      .get("https://data.covid19india.org/v4/min/timeseries.min.json")
      .then((res) => {
        setResponseData(res.data);
      })
      .catch((err) =>
        setErrorMsg("No data found, please try with other parameters"),
      );
  };

  useEffect(() => {
    setErrorMsg("");
  }, []);
  useEffect(() => {
    if (responseData && responseData[selectedDDCode]) {
      console.log(enteredDate);
      console.log(responseData[selectedDDCode]["dates"][enteredDate]);
      if (responseData[selectedDDCode]["dates"][enteredDate]) {
        setTotalCases(responseData[selectedDDCode]["dates"][enteredDate].total);
      } else {
        setErrorMsg("No data found, please try with other parameters");
      }
    }
  }, [responseData]);

  return (
    <>
      <div className="App">
        <select
          name="states"
          label="states"
          required
          id="states"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          {statesList.map((each) => (
            <option key={each} value={each}>
              {each}
            </option>
          ))}
        </select>
        <input
          type="date"
          required
          className="Submit"
          placeholder="Please Enter Date"
          value={enteredDate}
          onChange={dateChangeHandler}
        />
        <button className="Submit" onClick={submitBtnHandler}>
          Submit
        </button>
        <button className="Submit" onClick={onReset}>
          Reset
        </button>
      </div>
      <div className="App">
        {totalCases.tested ? <p>Tested: {totalCases.tested}</p> : null}
        {totalCases.recovered ? <p>Recovered: {totalCases.recovered}</p> : null}
        {totalCases.confirmed ? <p>Confirmed: {totalCases.confirmed}</p> : null}
        {errorMsg ? <p className="errorMsg">{errorMsg}</p> : null}
      </div>
    </>
  );
}

export default CovidApp;