from rest_framework.decorators import api_view
from rest_framework.response import Response
from google.cloud import bigquery
from .serializers import TaxiTripSerializer
from concurrent.futures import ThreadPoolExecutor
import functools
import time

# Initialize BigQuery client and connection pool
bigquery_client = bigquery.Client()

def fetch_data_async(query):
    # Inner function to execute query and return result
    def _fetch_data(client, query):
        query_job = client.query(query)
        result = query_job.result().to_dataframe()
        return result.to_dict('records')[0] if not result.empty else None

    # Use functools.partial to pass the client to _fetch_data
    return functools.partial(_fetch_data, bigquery_client, query)()

@api_view(['GET'])
def get_data(request, table_name):
    start_time = time.time()  # Start measuring time
    queries = {
        'avg_journey_time': f'''
            SELECT ROUND(AVG(TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND)) / 60, 2) AS avg_journey_time 
            FROM `bigquery-public-data.new_york.{table_name}`
            WHERE TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND) > 60
            AND TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND) < 86400
            AND dropoff_datetime > pickup_datetime
        ''',
        'min_journey_time': f'''
            SELECT ROUND(MIN(TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND)) / 60, 2) AS min_journey_time 
            FROM `bigquery-public-data.new_york.{table_name}`
            WHERE TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND) > 60
            AND TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND) < 86400
            AND dropoff_datetime > pickup_datetime
        ''',
        'max_journey_time': f'''
            SELECT ROUND(MAX(TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND)) / 60, 2) AS max_journey_time
            FROM `bigquery-public-data.new_york.{table_name}`
            WHERE TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND) > 60
            AND TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND) < 86400
            AND dropoff_datetime > pickup_datetime
        ''',
        'avg_total_cost': f'''
            SELECT ROUND(AVG(total_amount), 2) AS avg_total_cost 
            FROM `bigquery-public-data.new_york.{table_name}`
            WHERE total_amount > 1
        ''',
        'min_total_cost': f'''
            SELECT ROUND(MIN(total_amount), 2) AS min_total_cost  
            FROM `bigquery-public-data.new_york.{table_name}`
            WHERE total_amount > 1
        ''',
        'max_total_cost': f'''
            SELECT ROUND(MAX(total_amount), 2) AS max_total_cost
            FROM `bigquery-public-data.new_york.{table_name}`
            WHERE total_amount > 1
        ''',
        'most_popular_time_of_day': f'''
            SELECT EXTRACT(HOUR FROM pickup_datetime) AS hour, COUNT(*) AS count 
            FROM `bigquery-public-data.new_york.{table_name}` 
            WHERE TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND) > 60
            AND TIMESTAMP_DIFF(dropoff_datetime, pickup_datetime, SECOND) < 86400
            AND dropoff_datetime > pickup_datetime
            GROUP BY hour 
            ORDER BY count DESC 
            LIMIT 1
        ''',
        'avg_tip_amount': f'''
            SELECT ROUND(AVG(tip_amount), 2) AS avg_tip_amount  
            FROM `bigquery-public-data.new_york.{table_name}`
            WHERE tip_amount > 0
        ''',
        'most_popular_pickup_location': f'''
            SELECT ROUND(pickup_latitude, 4) AS latitude, ROUND(pickup_longitude, 4) AS longitude, COUNT(*) AS pickup_count
            FROM `bigquery-public-data.new_york.{table_name}`
            WHERE pickup_latitude IS NOT NULL AND pickup_longitude IS NOT NULL
            AND pickup_latitude != 0 AND pickup_longitude != 0
            GROUP BY latitude, longitude
            ORDER BY pickup_count DESC
            LIMIT 1
        ''',
        'most_popular_dropoff_location': f'''
            SELECT ROUND(dropoff_latitude, 4) AS latitude, ROUND(dropoff_longitude, 4) AS longitude, COUNT(*) AS dropoff_count
            FROM `bigquery-public-data.new_york.{table_name}`
            WHERE dropoff_latitude IS NOT NULL AND dropoff_longitude IS NOT NULL
            AND dropoff_latitude != 0 AND dropoff_longitude != 0
            GROUP BY latitude, longitude
            ORDER BY dropoff_count DESC
            LIMIT 1
        ''',
    }

    results = {}
    with ThreadPoolExecutor() as executor:
        futures = {key: executor.submit(fetch_data_async, query) for key, query in queries.items()}
        for key, future in futures.items():
            results[key] = future.result()

    data = {
        'avg_journey_time': results.get('avg_journey_time', {}).get('avg_journey_time'),
        'min_journey_time': max(results.get('min_journey_time', {}).get('min_journey_time', 0), 0),  # Ensure non-negative values
        'max_journey_time': results.get('max_journey_time', {}).get('max_journey_time'),
        'avg_total_cost': results.get('avg_total_cost', {}).get('avg_total_cost'),
        'min_total_cost': max(results.get('min_total_cost', {}).get('min_total_cost', 0), 0),  # Ensure non-negative values
        'max_total_cost': results.get('max_total_cost', {}).get('max_total_cost'),
        'most_popular_time_of_day': results.get('most_popular_time_of_day', {}),
        'avg_tip_amount': results.get('avg_tip_amount', {}).get('avg_tip_amount'),
        'most_popular_pickup_location': {
            'latitude': results.get('most_popular_pickup_location', {}).get('latitude'),
            'longitude': results.get('most_popular_pickup_location', {}).get('longitude'),
            'count': results.get('most_popular_pickup_location', {}).get('pickup_count'),
        },
        'most_popular_dropoff_location': {
            'latitude': results.get('most_popular_dropoff_location', {}).get('latitude'),
            'longitude': results.get('most_popular_dropoff_location', {}).get('longitude'),
            'count': results.get('most_popular_dropoff_location', {}).get('dropoff_count'),
        },
    }

    serializer = TaxiTripSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    end_time = time.time()  # End measuring time
    elapsed_time = end_time - start_time
    print(f"API took {elapsed_time:.2f} seconds to compute.")  # Print elapsed time

    return Response(serializer.data)
