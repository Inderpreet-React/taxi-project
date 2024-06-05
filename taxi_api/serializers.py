# taxi_api/serializers.py

from rest_framework import serializers

class TaxiTripSerializer(serializers.Serializer):
    avg_journey_time = serializers.FloatField()
    min_journey_time = serializers.FloatField()
    max_journey_time = serializers.FloatField()
    avg_total_cost = serializers.FloatField()
    min_total_cost = serializers.FloatField()
    max_total_cost = serializers.FloatField()
    most_popular_pickup_location = serializers.DictField()
    most_popular_dropoff_location = serializers.DictField()
    most_popular_time_of_day = serializers.DictField()
    avg_tip_amount = serializers.FloatField()
