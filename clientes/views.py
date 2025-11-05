from django.shortcuts import render
from django.http import HttpResponse
from .models import Cliente
from django.http import JsonResponse
from django.http import HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect

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


# ==============================
# Modificar un cliente existente
# ==============================
@csrf_exempt
def modificar_cliente(request, id):
    """
    Permite actualizar los datos de un cliente existente.
    Puede recibir datos vía POST (formulario tradicional o AJAX).
    """
    if request.method == 'POST':
        try:
            cliente = Cliente.objects.get(pk=id)
        except Cliente.DoesNotExist:
            return JsonResponse({'success': False, 'message': '❌ Cliente no encontrado'}, status=404)

        # Actualizamos los campos recibidos
        cliente.tipoDocumento = request.POST.get('tipoDocumento', cliente.tipoDocumento)
        cliente.nombre = request.POST.get('nombre', cliente.nombre)
        cliente.numeroDocumento = request.POST.get('numeroDocumento', cliente.numeroDocumento)
        cliente.telefono = request.POST.get('telefono', cliente.telefono)
        cliente.correo = request.POST.get('correo', cliente.correo)
        cliente.ciudad = request.POST.get('ciudad', cliente.ciudad)
        cliente.direccion = request.POST.get('direccion', cliente.direccion)
        cliente.save()

        return JsonResponse({'success': True, 'message': '✅ Cliente modificado correctamente'})

    else:
        return HttpResponseNotAllowed(['POST'])
    




@csrf_exempt
def obtener_cliente(request, id):
    """
    Devuelve los datos de un cliente en formato JSON.
    """
    if request.method == 'GET':
        try:
            cliente = Cliente.objects.get(pk=id)
            return JsonResponse({
                'success': True,
                'cliente': {
                    'idCliente': cliente.idCliente,
                    'tipoDocumento': cliente.tipoDocumento,
                    'nombre': cliente.nombre,
                    'numeroDocumento': cliente.numeroDocumento,
                    'telefono': cliente.telefono,
                    'correo': cliente.correo,
                    'ciudad': cliente.ciudad,
                    'direccion': cliente.direccion
                }
            })
        except Cliente.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Cliente no encontrado'}, status=404)
    else:
        return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)
    
    



@csrf_exempt
def eliminar_cliente(request, id):
    if request.method == 'DELETE':
        try:
            cliente = Cliente.objects.get(pk=id)
            cliente.delete()
            return JsonResponse({'mensaje': 'Cliente eliminado correctamente'})
        except Cliente.DoesNotExist:
            return JsonResponse({'error': 'Cliente no encontrado'}, status=404)
    else:
        return HttpResponseNotAllowed(['DELETE'])


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
    