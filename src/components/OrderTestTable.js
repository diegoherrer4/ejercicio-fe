import React, { useState, useEffect } from "react";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import ReactPaginate from "react-paginate";

const API_ENDPOINT =
  "https://biostatistics.salud.pr.gov/orders/tests/covid-19/minimal";
const ROWS_PER_PAGE = 10;

const OrderTestTable = () => {
  const [orderTests, setOrderTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // start at page 0 for react-paginate
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    const fetchOrderTests = async () => {
      setLoading(true);
      try {
        let queryUrl = API_ENDPOINT;
        if (dateRange.start && dateRange.end) {
          const start = dateRange.start.toISOString();
          const end = dateRange.end.toISOString();
          queryUrl += `?sampleCollectedStartDate=${start}&sampleCollectedEndDate=${end}`;
        }
        // add page and perPage to the query URL
        // queryUrl += `&page=${currentPage}&perPage=${ROWS_PER_PAGE}`;
        const response = await fetch(queryUrl);
        const data = await response.json();
        console.log(dateRange);
        setOrderTests(data.orderTests);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (dateRange.start && dateRange.end) {
      fetchOrderTests();
    }
  }, [dateRange, currentPage]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // update the current page number
  };

  const renderOrderTestRows = () => {
    const orderTestsToShow = orderTests;

    return orderTestsToShow.map((orderTest) => (
      <tr key={orderTest.orderTestId}>
        <td>{orderTest.orderTestId}</td>
        <td>{orderTest.patientId}</td>
        <td>{orderTest.patientAgeRange}</td>
        <td>{orderTest.patientRegion}</td>
        <td>{orderTest.orderTestCategory}</td>
        <td>{orderTest.orderTestType}</td>
        <td>{orderTest.sampleCollectedDate}</td>
        <td>{orderTest.resultReportDate}</td>
        <td>{orderTest.orderTestResult}</td>
        <td>{orderTest.orderTestCreatedAt}</td>
      </tr>
    ));
  };

  return (
    <div>
      <DateRangePicker
        value={dateRange}
        onSelect={(range) => setDateRange(range)}
        maximumDate={new Date()}
        maxRangeDuration={7}
      />

      {loading && <div>Loading...</div>}

      {!loading && orderTests.length === 0 && <div>No data found.</div>}

      {!loading && orderTests.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Order Test ID</th>
                <th>Patient ID</th>
                <th>Patient Age Range</th>
                <th>Patient Region</th>
                <th>Order Test Category</th>
                <th>Order Test Type</th>
                <th>Sample Collected Date</th>
                <th>Result Report Date</th>
                <th>Order Test Result</th>
                <th>Order Test Created At</th>
              </tr>
            </thead>
            <tbody>{renderOrderTestRows()}</tbody>
          </table>
          <div className="pagination-container">
            <ReactPaginate
              pageCount={Math.ceil(orderTests.length / ROWS_PER_PAGE)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={(data) => handlePageClick(data)}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTestTable;
