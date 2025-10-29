from django.shortcuts import render
from django.http import HttpResponse
from .models import Cliente
from django.http import JsonResponse

# Realizamos el Registro

def clientes_view(request):
    return render(request, 'clientes.html')



def clientes_data(request):
    clientes = Cliente.objects.all().values(
        'idCliente', 'tipoDocumento', 'nombre',
        'numeroDocumento', 'telefono', 'correo',
        'ciudad', 'direccion'
    )
    data = list(clientes)
    return JsonResponse({'data': data})


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
            return JsonResponse({
                'success': False,
                'message': '❌ Ya existe un cliente con esa cédula.'
            }, status=400)

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

        return JsonResponse({
            'success': True,
            'message': '✅ Cliente registrado exitosamente.'
        })

    return render(request, 'registro.html')


    # Validamos cedula en tiempo real
def validar_cedula(request):
    numeroDocumento = request.GET.get('documento', None)

    if not numeroDocumento:
        return JsonResponse({'error': 'No se proporcionó número de documento'}, status=400)

    try:
        cliente = Cliente.objects.get(numeroDocumento=numeroDocumento)
        # Si lo encuentra, devolvemos los datos
        return JsonResponse({
            'existe': True,
            'cliente': {
                'nombre': cliente.nombre,
                'telefono': cliente.telefono,
                'correo': cliente.correo,
                'ciudad': cliente.ciudad,
                'direccion': cliente.direccion
            }
        })
    except Cliente.DoesNotExist:
        # Si no existe, devolvemos solo existe=False
        return JsonResponse({'existe': False})