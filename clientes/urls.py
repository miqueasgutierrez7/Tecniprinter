from django.urls import path
from . import views



urlpatterns = [
    path('registrar/', views.registrar_cliente, name='registrar_cliente'),
    path('validar-cedula/', views.validar_cedula, name='validar_cedula'),
    path('clientes/', views.clientes_view, name='clientes'),
    path('api/clientes/', views.clientes_data, name='clientes_data'),
    path('api/clientes/<int:id>/', views.eliminar_cliente, name='eliminar_cliente'),
    path('api/clientes/modificar/<int:id>/', views.modificar_cliente, name='modificar_cliente'),
    path('clientes/<int:id>/', views.obtener_cliente, name='obtener_cliente'),
]