import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import axios from "axios";
import { Container, Spinner } from "react-bootstrap";
import TableSelector from "./components/TableSelector";
import ChartTypeSelector from "./components/ChartTypeSelector";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Advantages from "./components/Advantages";

const tables = [
  "tlc_green_trips_2013",
  "tlc_green_trips_2014",
  "tlc_green_trips_2015",
  "tlc_green_trips_2016",
  "tlc_yellow_trips_2009",
  "tlc_yellow_trips_2010",
  "tlc_yellow_trips_2011",
  "tlc_yellow_trips_2012",
  "tlc_yellow_trips_2013",
  "tlc_yellow_trips_2014",
  "tlc_yellow_trips_2015",
  "tlc_yellow_trips_2016",
];

const chartTypes = ["Line", "Pie", "Bar", "Radar", "Doughnut"];

const Statistics = lazy(() => import("./components/Statistics"));
const MapComponent = lazy(() => import("./components/MapComponent"));
const PopularTime = lazy(() => import("./components/PopularTime"));
const PopularTip = lazy(() => import("./components/PopularTip"));

const App = () => {
  const [selectedTable, setSelectedTable] = useState(tables[0]);
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0]);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [pickupLocation, setPickupLocation] = useState({});
  const [dropoffLocation, setDropoffLocation] = useState({});
  const [loading, setLoading] = useState(true);
  const [popularTime, setPopularTime] = useState({});
  const [avgTipAmount, setAvgTipAmount] = useState(0);

  const fetchData = useCallback(async (table) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/data/${table}/`
      );
      const data = response.data;

      const labels = ["Average", "Minimum", "Maximum"];
      const journeyTimeData = [
        data.avg_journey_time,
        data.min_journey_time,
        data.max_journey_time,
      ];
      const totalCostData = [
        data.avg_total_cost,
        data.min_total_cost,
        data.max_total_cost,
      ];

      setChartData({
        journeyTime: {
          labels,
          datasets: [
            {
              label: "Journey Time",
              data: journeyTimeData,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderWidth: 1,
            },
          ],
        },
        totalCost: {
          labels,
          datasets: [
            {
              label: "Total Cost",
              data: totalCostData,
              backgroundColor: ["#4BC0C0", "#9966FF", "#FF9F40"],
              borderColor: ["#4BC0C0", "#9966FF", "#FF9F40"],
              borderWidth: 1,
            },
          ],
        },
      });

      setStats({
        avgJourneyTime: data.avg_journey_time,
        minJourneyTime: data.min_journey_time,
        maxJourneyTime: data.max_journey_time,
        avgTotalCost: data.avg_total_cost,
        minTotalCost: data.min_total_cost,
        maxTotalCost: data.max_total_cost,
      });

      setPickupLocation(data.most_popular_pickup_location);
      setDropoffLocation(data.most_popular_dropoff_location);
      setPopularTime(data.most_popular_time_of_day);
      setAvgTipAmount(data.avg_tip_amount);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedTable);
  }, [fetchData, selectedTable]);

  const debouncedSetSelectedTable = useCallback(
    debounce((table) => {
      setSelectedTable(table);
    }, 300),
    []
  );

  const handleTableSelect = (table) => {
    debouncedSetSelectedTable(table);
  };

  const handleChartTypeSelect = (chartType) => {
    setSelectedChartType(chartType);
  };

  return (
    <div>
      <header className="header">
        <img
          src={require("./images/banner.png")}
          alt="banner"
          className="banner-image"
        />
        <div className="overlay"></div>
        <h1 className="mb-4 header-title">
          Welcome to New York Taxi Services Data Visualization
        </h1>
        <p className="header-p">We pickup and drop you on time</p>
      </header>
      <Advantages />
      <Container className="my-4 main-page">
        <TableSelector
          tables={tables}
          selectedTable={selectedTable}
          onSelectTable={handleTableSelect}
        />
        <ChartTypeSelector
          chartTypes={chartTypes}
          selectedChartType={selectedChartType}
          onSelectChartType={handleChartTypeSelect}
        />
        {loading ? (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center my-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            }
          >
            <Statistics
              stats={stats}
              chartData={chartData}
              selectedChartType={selectedChartType}
            />
            <MapComponent
              pickupLocation={pickupLocation}
              dropoffLocation={dropoffLocation}
            />
            <PopularTime popularTime={popularTime} />
            <PopularTip avgTipAmount={avgTipAmount} />
          </Suspense>
        )}
      </Container>
      <footer className="footer bg-dark text-white text-center py-3">
        <div className="container">
          <div className="footer-items">
            <div className="footer-item">
              <img
                src={require("./images/headset-icon.png")}
                alt="Customer Support"
                className="footer-icon"
              />
              <span>24/7 CUSTOMER SUPPORT</span>
            </div>
            <div className="footer-item">
              <img
                src={require("./images/email-icon.png")}
                alt="Email"
                className="footer-icon"
              />
              <span>BOOKING@NEWYORKTAXI.COM</span>
            </div>
            <div className="footer-item">
              <img
                src={require("./images/phone-icon.png")}
                alt="Phone"
                className="footer-icon"
              />
              <span>+44 (0)121 123456789 OR 0987654321</span>
            </div>
            <div className="footer-item">
              <img
                src={require("./images/support-ticket-icon.png")}
                alt="Support Ticket"
                className="footer-icon"
              />
              <span>SUPPORT TICKET</span>
            </div>
          </div>
          <p>&copy; 2024 New York Taxi Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// --------------------?
// import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
// import axios from "axios";
// import { Container, Spinner } from "react-bootstrap";
// import TableSelector from "./components/TableSelector";
// import ChartTypeSelector from "./components/ChartTypeSelector";
// import "./App.css";

// const tables = [
//   "tlc_green_trips_2013",
//   "tlc_green_trips_2014",
//   "tlc_green_trips_2015",
//   "tlc_green_trips_2016",
//   "tlc_yellow_trips_2009",
//   "tlc_yellow_trips_2010",
//   "tlc_yellow_trips_2011",
//   "tlc_yellow_trips_2012",
//   "tlc_yellow_trips_2013",
//   "tlc_yellow_trips_2014",
//   "tlc_yellow_trips_2015",
//   "tlc_yellow_trips_2016",
// ];

// const chartTypes = ["Line", "Pie", "Bar", "Radar", "Doughnut"];

// const Statistics = lazy(() => import("./components/Statistics"));
// const MapComponent = lazy(() => import("./components/MapComponent"));
// const PopularTime = lazy(() => import("./components/PopularTime"));
// const PopularTip = lazy(() => import("./components/PopularTip"));

// const App = () => {
//   const [selectedTable, setSelectedTable] = useState(tables[0]);
//   const [selectedChartType, setSelectedChartType] = useState(chartTypes[0]);
//   const [stats, setStats] = useState({});
//   const [chartData, setChartData] = useState({ labels: [], datasets: [] });
//   const [pickupLocation, setPickupLocation] = useState({});
//   const [dropoffLocation, setDropoffLocation] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [popularTime, setPopularTime] = useState({});
//   const [avgTipAmount, setAvgTipAmount] = useState(0);

//   const fetchData = useCallback(async (table) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:8000/api/data/${table}/`
//       );
//       const data = response.data;

//       const labels = ["Average", "Minimum", "Maximum"];
//       const journeyTimeData = [
//         data.avg_journey_time,
//         data.min_journey_time,
//         data.max_journey_time,
//       ];
//       const totalCostData = [
//         data.avg_total_cost,
//         data.min_total_cost,
//         data.max_total_cost,
//       ];

//       setChartData({
//         journeyTime: {
//           labels,
//           datasets: [
//             {
//               label: "Journey Time",
//               data: journeyTimeData,
//               backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
//               borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
//               borderWidth: 1,
//             },
//           ],
//         },
//         totalCost: {
//           labels,
//           datasets: [
//             {
//               label: "Total Cost",
//               data: totalCostData,
//               backgroundColor: ["#4BC0C0", "#9966FF", "#FF9F40"],
//               borderColor: ["#4BC0C0", "#9966FF", "#FF9F40"],
//               borderWidth: 1,
//             },
//           ],
//         },
//       });

//       setStats({
//         avgJourneyTime: data.avg_journey_time,
//         minJourneyTime: data.min_journey_time,
//         maxJourneyTime: data.max_journey_time,
//         avgTotalCost: data.avg_total_cost,
//         minTotalCost: data.min_total_cost,
//         maxTotalCost: data.max_total_cost,
//       });

//       setPickupLocation(data.most_popular_pickup_location);
//       setDropoffLocation(data.most_popular_dropoff_location);
//       setPopularTime(data.most_popular_time_of_day);
//       setAvgTipAmount(data.avg_tip_amount);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData(selectedTable);
//   }, [fetchData, selectedTable]);

//   const debouncedSetSelectedTable = useCallback(
//     debounce((table) => {
//       setSelectedTable(table);
//     }, 300),
//     []
//   );

//   const handleTableSelect = (table) => {
//     debouncedSetSelectedTable(table);
//   };

//   const handleChartTypeSelect = (chartType) => {
//     setSelectedChartType(chartType);
//   };

//   return (
//     <Container className="my-4 main-page">
//       <h1 className="mb-4 header">
//         Welcome to New York Taxi Services Data Visualization
//       </h1>
//       <TableSelector
//         tables={tables}
//         selectedTable={selectedTable}
//         onSelectTable={handleTableSelect}
//       />
//       <ChartTypeSelector
//         chartTypes={chartTypes}
//         selectedChartType={selectedChartType}
//         onSelectChartType={handleChartTypeSelect}
//       />
//       {loading ? (
//         <div className="d-flex justify-content-center my-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//         </div>
//       ) : (
//         <Suspense
//           fallback={
//             <div className="d-flex justify-content-center my-4">
//               <Spinner animation="border" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </Spinner>
//             </div>
//           }
//         >
//           <Statistics
//             stats={stats}
//             chartData={chartData}
//             selectedChartType={selectedChartType}
//           />
//           <MapComponent
//             pickupLocation={pickupLocation}
//             dropoffLocation={dropoffLocation}
//           />
//           <PopularTime popularTime={popularTime} />
//           <PopularTip avgTipAmount={avgTipAmount} />
//         </Suspense>
//       )}
//     </Container>
//   );
// };

// export default App;

// function debounce(func, delay) {
//   let timer;
//   return function (...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       func.apply(this, args);
//     }, delay);
//   };
// }
