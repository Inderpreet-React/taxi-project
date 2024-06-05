from django.urls import path
from . import views

urlpatterns = [
     path('data/<str:table_name>/', views.get_data, name='get_data'),
]