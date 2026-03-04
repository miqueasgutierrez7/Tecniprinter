from django.urls import path
from . import views

urlpatterns = [
    path("servicios/", views.lista_servicios, name="lista_servicios"),
    path("servicios/registrar/", views.registrar_servicio, name="registrar_servicio"),
    path(
        "api/reparacionimpresora/",
        views.ReparacionImpresora_data,
        name="reparacionimpresora_data",
    ),
    path(
        "pdf_impresora/<int:id>/",
        views.recibo_pdf_impresora,
        name="recibo_pdf_impresora",
    ),
    path(
        "pdf_computador/<int:id>/",
        views.recibo_pdf_computador,
        name="recibo_pdf_computador",
    ),
    path("pdf_toner/<int:id>/", views.recibo_pdf_toner, name="recibo_pdf_toner"),
]
