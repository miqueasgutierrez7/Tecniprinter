from django.shortcuts import render
from django.http import HttpResponse
from .models import Cliente
from django.http import JsonResponse

# Realizamos el Registro
def registrar_cliente(request):
    if request.method == 'POST':
        tipoDocumento = request.POST.get('tipoDocumento')
        nombre = request.POST.get('nombre')
        numeroDocumento = request.POST.get('documento')
        telefono = request.POST.get('telefono')
        correo = request.POST.get('correo')
        ciudad = request.POST.get('ciudad')
        direccion = request.POST.get('direccion')

        # Validar si ya existe esa cédula
        if Cliente.objects.filter(numeroDocumento=numeroDocumento).exists():
            return HttpResponse("❌ Ya existe un cliente con esa cédula.", status=400)

        # Si no existe, crear cliente
        Cliente.objects.create(
            tipoDocumento=tipoDocumento,
            nombre=nombre,
            numeroDocumento=numeroDocumento,
            telefono=telefono,
            correo=correo,
            ciudad=ciudad,
            direccion=direccion
        )
        return HttpResponse("✅ Cliente registrado exitosamente.")

    return render(request, 'registro.html')


    # Validamos cedula en tiempo real
def validar_cedula(request):
    numeroDocumento = request.GET.get('documento', None)

    if numeroDocumento:
        existe = Cliente.objects.filter(numeroDocumento=numeroDocumento).exists()
        return JsonResponse({'existe': existe})
    else:
        return JsonResponse({'error': 'No se proporcionó número de documento'}, status=400)