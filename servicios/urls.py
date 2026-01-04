from django.urls import path
from . import views

urlpatterns = [
    path("servicios/", views.lista_servicios, name="lista_servicios"),
    path("servicios/registrar/", views.registrar_servicio, name="registrar_servicio"),
]
