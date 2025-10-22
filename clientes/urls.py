from django.urls import path
from . import views

urlpatterns = [
    path('registrar/', views.registrar_cliente, name='registrar_cliente'),
    path('validar-cedula/', views.validar_cedula, name='validar_cedula'),

]