from clientes.models import Cliente
from servicios.models import (
    Servicio,
    Abono,
    ReparacionPC,
    ReparacionImpresora,
    RecargaToner,
)
from django.shortcuts import render
from django.db import transaction
from decimal import Decimal
from django.http import JsonResponse


def lista_servicios(request):
    # No enviamos datos, solo renderizamos el template
    return render(request, "registro.html")


def registrar_servicio(request):
    try:
        with transaction.atomic():

            # =========================
            # 1. CLIENTE
            # =========================
            documento = request.POST.get("documento")

            cliente, creado = Cliente.objects.get_or_create(
                documento=documento,
                defaults={
                    "tipoDocumento": request.POST.get("tipoDocumento"),
                    "nombre": request.POST.get("nombre"),
                    "telefono": request.POST.get("telefono"),
                    "correo": request.POST.get("correo"),
                    "ciudad": request.POST.get("ciudad"),
                    "direccion": request.POST.get("direccion"),
                }
            )

            # =========================
            # 2. SERVICIO
            # =========================
            servicio = Servicio.objects.create(
                cliente=cliente,
                tipoServicio=request.POST.get("tipoServicio"),
                observaciones=request.POST.get("observaciones"),
                valorServicio=Decimal(request.POST.get("valorServicio") or 0),
                estado=request.POST.get("estado", "REC"),
            )

            # =========================
            # 3. DETALLES SEGÚN TIPO
            # =========================
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
                    solucion=request.POST.get("pc_solucion"),
                )

            elif tipo == "TON":
                RecargaToner.objects.create(
                    servicio=servicio,
                    modelo_toner=request.POST.get("toner_modelo"),
                )

            # =========================
            # 4. ABONO (OPCIONAL)
            # =========================
            abono = request.POST.get("Abono")

            if abono and Decimal(abono) > 0:
                Abono.objects.create(
                    servicio=servicio,
                    monto=Decimal(abono)
                )

            # =========================
            # RESPUESTA JSON
            # =========================
            return JsonResponse({
                "success": True,
                "message": "Servicio registrado correctamente",
                "servicio_id": servicio.idServicio,
            })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)