from django.shortcuts import render
from django.http import JsonResponse
from decimal import Decimal
from servicios.models import (
    Cliente,
    Servicio,
    Abono,
    ReparacionPC,
    ReparacionImpresora,
    RecargaToner,
)


def lista_servicios(request):
    return render(request, "registro.html")


def registrar_servicio(request):
    documento = request.POST.get("documento")
    cliente, creado = Cliente.objects.get_or_create(
        numeroDocumento=documento,
        defaults={
            "tipoDocumento": request.POST.get("tipoDocumento"),
            "nombre": request.POST.get("nombre"),
            "telefono": request.POST.get("telefono"),
            "correo": request.POST.get("correo"),
            "ciudad": request.POST.get("ciudad"),
            "direccion": request.POST.get("direccion"),
        },
    )

    servicio: Servicio = Servicio.objects.create(
        cliente=cliente,
        tipoServicio=request.POST.get("tipoServicio"),
        observaciones=request.POST.get("observaciones"),
        valorServicio=Decimal(request.POST.get("valorServicio") or 0),
        estado=request.POST.get("estado", "REC"),
    )

    tipo = servicio.tipoServicio
    if tipo == "PC":
        ReparacionPC.objects.create(
            servicio=servicio,
            marca=request.POST.get("pc_marca"),
            modelo=request.POST.get("pc_modelo"),
            serial=request.POST.get("pc_serial"),
            problema=request.POST.get("pc_problema"),
            solucion=request.POST.get("pc_solucion"),
        )
    elif tipo == "IMP":
        ReparacionImpresora.objects.create(
            servicio=servicio,
            marca=request.POST.get("imp_marca"),
            modelo=request.POST.get("imp_modelo"),
            serial=request.POST.get("imp_serial"),
            falla=request.POST.get("imp_diagnostico"),
            solucion=request.POST.get("imp_solucion"),
        )
    elif tipo == "TON":
        RecargaToner.objects.create(
            servicio=servicio,
            modelo_toner=request.POST.get("toner_modelo"),
        )

    abono = request.POST.get("abono")
    if abono and Decimal(abono) > 0:
        Abono.objects.create(servicio=servicio, monto=Decimal(abono))

    return JsonResponse(
        {"success": True, "message": "✅ Ingreso registrado exitosamente."}
    )


def ReparacionImpresora_data(request):
    reparaciones = ReparacionImpresora.objects.select_related("servicio__cliente")
    data = []
    for r in reparaciones:
        data.append(
            {
                "id": r.id,
                "marca": r.marca,
                "modelo": r.modelo,
                "serial": r.serial,
                "cliente": r.servicio.cliente.nombre,
                "telefono": r.servicio.cliente.telefono,
                "estado": r.servicio.get_estado_display(),  # aquí el nombre legible
            }
        )
    return JsonResponse({"data": data})
