# servicios/views.py
# servicios/views.py
from django.shortcuts import render

def lista_servicios(request):
    # No enviamos datos, solo renderizamos el template
    return render(request, "registro.html")

