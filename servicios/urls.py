from django.urls import path
from . import views

urlpatterns = [
    path("servicios/", views.lista_servicios, name="lista_servicios"),
    path("servicios/editar/<int:id>/", views.editar_servicio_impresora, name="editar_servicio_impresora"),
    path("servicioscomputador/editar/<int:id>/", views.editar_servicio_computador, name="editar_servicio_computador"),
    path("servicios/registrar/", views.registrar_servicio, name="registrar_servicio"),
    path(
        "api/reparacionimpresora/",
        views.ReparacionImpresora_data,
        name="reparacionimpresora_data",
    ),
    path(
        "api/reparacioncomputadores/",
        views.ReparacionComputadores_data,
        name="reparacioncomputadores_data",
    ),
    path(
        "pdf_impresora/<int:id>/",
        views.recibo_pdf_impresora,
        name="recibo_pdf_impresora",
    ),
    path(
        "api/recargatoner/",
        views.RecargaToner_data,
        name="recargatoner_data",
    ),
    path(
        "pdf_computador/<int:id>/",
        views.recibo_pdf_computador,
        name="recibo_pdf_computador",
    ),
    path("pdf_toner/<int:id>/", views.recibo_pdf_toner, name="recibo_pdf_toner"),
    path("servicioimpresora/<int:id>/", views.obtener_servicioimpresora, name="obtener_servicioimpresora"),
    path("serviciocomputadora/<int:id>/", views.obtener_serviciocomputador, name="obtener_serviciocomputador"),
    path("serviciotoner/<int:id>/", views.obtener_serviciotoner, name="obtener_serviciotoner"),
]
