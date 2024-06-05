**New York Taxi Services Data Visualization**

**Overview**
This project visualizes New York Taxi Services data using a React frontend and a Django REST framework backend. The backend interacts with Google's BigQuery to fetch and process data from taxi trip tables. The frontend displays the data using various chart types and provides user-friendly interfaces for selecting data and visualization options.

**Features**

**Backend**
Fetch Data from BigQuery: Utilizes Google's BigQuery to run SQL queries on taxi trip data.
Data Processing: Computes statistics such as average, minimum, and maximum journey times and costs, most popular pickup and dropoff locations, and more.
Async Data Fetching: Executes multiple queries concurrently for efficient data retrieval.

**Frontend**
Data Visualization: Displays data in various chart formats (Line, Pie, Bar, Radar, Doughnut) using Chart.js.
Map Integration: Shows most popular pickup and dropoff locations on a Google Map.
Interactive UI: Allows users to select different datasets and chart types for dynamic data exploration.

**Project Structure**

**Backend**
Serializers: Defines data structures for serializing query results.
URLs: Routes API requests to the appropriate views.
Views: Handles API requests, fetches data from BigQuery, processes it, and returns JSON responses.

**Frontend**
Components: Modular React components for various UI elements like table selectors, chart type selectors, statistics display, map display, and more.
API Integration: Fetches data from the backend API and updates the state to reflect in the UI.
Styling: Uses Bootstrap for responsive design and custom CSS for additional styling.

**Installation and Setup**

**Backend**
**Install Dependencies**: Ensure you have Python and pip installed. Install the required packages using pip install.
**Configure BigQuery:** Set up Google Cloud credentials for BigQuery access.
**Run Server:** Start the Django development server:
python manage.py runserver

**Frontend**
**Install Dependencies**: Ensure you have Node.js and npm installed. Install the required packages using:
npm install
Start the React development server: npm start

**Usage**
**Select Dataset:** Use the table selector to choose a specific taxi trip dataset (e.g., tlc_green_trips_2013).
**Choose Chart Type**: Select the desired chart type for data visualization.
**View Data**: Observe various statistics, charts, and maps reflecting the selected dataset.

**API Endpoints**
GET /data/str:table_name/: Fetches processed statistics for the specified table.

**Key Components**

**Statistics**: Displays journey time and cost metrics.
**MapComponent**: Shows popular pickup and dropoff locations on a Google Map.
**PopularTime**: Displays the most popular time of day for taxi trips.
**PopularTip**: Shows the average tip amount for taxi trips.






