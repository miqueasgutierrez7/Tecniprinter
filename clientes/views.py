from django.shortcuts import render
from django.http import HttpResponse
from .models import Cliente

def registrar_cliente(request):
    if request.method == 'POST':
        Cliente.objects.create(
            idArea = request.POST.get('idArea'),
            tipoDocumento = request.POST.get('tipoDocumento'),
            nombre = request.POST.get('nombre'),
            numeroDocumento = request.POST.get('numeroDocumento'),
            telefono = request.POST.get('telefono'),
            correo = request.POST.get('correo'),
            ciudad = request.POST.get('ciudad'),
            direccion = request.POST.get('direccion')
        )
        return HttpResponse("Cliente registrado exitosamente.")

    return render(request, 'registro.html')