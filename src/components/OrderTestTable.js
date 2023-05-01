import React, { useState, useEffect } from "react";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import ReactPaginate from "react-paginate";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OrderTestTable.css";

const API_ENDPOINT =
  "https://biostatistics.salud.pr.gov/orders/tests/covid-19/minimal";
const ROWS_PER_PAGE = 10;

const OrderTestTable = () => {
  const [orderTests, setOrderTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // start at page 0
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showRangeError, setShowRangeError] = useState(false);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const fetchOrderTests = async () => {
        setLoading(true);
        try {
          let queryUrl = API_ENDPOINT;
          const start = dateRange.start.toISOString();
          const end = dateRange.end.toISOString();
          queryUrl += `?sampleCollectedStartDate=${start}&sampleCollectedEndDate=${end}`;
          const response = await fetch(queryUrl);
          const data = await response.json();
          setOrderTests(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrderTests();
    }
  }, [dateRange]);

  const handleRangeSelect = (range) => {
    if (range.end && range.start && range.end - range.start > 604800000) {
      window.alert("Please select a date range of 7 days or less");
    } else {
      setShowRangeError(false);
      setDateRange(range);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // update the current page number
  };

  const renderOrderTestRows = () => {
    if (!orderTests || orderTests.length === 0) {
      return null;
    }

    const startIndex = currentPage * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const pageOrderTests = orderTests.slice(startIndex, endIndex);

    return pageOrderTests.map((orderTest) => (
      <tr key={orderTest.orderId}>
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
      {showRangeError &&
        window.alert("Please select a date range of 7 days or less")}

      <DateRangePicker
        value={dateRange}
        onSelect={handleRangeSelect}
        maximumDate={new Date()}
        maxRangeDuration={7}
      />

      {loading && (
        <div className="spinner">
          <Spinner animation="border" />
        </div>
      )}

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
              containerClassName={
                "pagination d-flex justify-content-center align-items-center"
              }
              activeClassName={"active"}
              pageClassName={"m-0"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              nextClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              disabledClassName={"disabled"}
              forcePage={currentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTestTable;
