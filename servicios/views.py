from multiprocessing import connection
from django.db import connection
from fpdf import FPDF
from django.http import JsonResponse, HttpResponse
from django.utils.timezone import localtime
from django.shortcuts import render
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
                "estado": r.servicio.get_estado_display(),
            }
        )
    return JsonResponse({"data": data})


def recibo_pdf(request):
    pdf = FPDF(orientation="P", unit="mm", format=(216, 140))
    pdf.add_page()
    pdf.image("static/images/logo.jpg", x=65, y=5, w=85)

    pdf.set_font("Arial", style="I", size=13)
    pdf.ln(18)
    pdf.cell(195, 10, txt="Carrera 30 #28-43", ln=True, align="C")
    pdf.ln(-4)
    pdf.cell(195, 10, txt="Cels : 318-553 9043 / 318-873 3880", ln=True, align="C")
    pdf.ln(-2)

    id_servicio = 2  # variable externa

    with connection.cursor() as cursor:
        cursor.execute(
            """
        SELECT s."idServicio" AS numero, c.nombre AS cliente, s."fechaIngreso", c.direccion, c.telefono, ri.marca, ri.modelo, ri.serial, ri.falla, ri.solucion, s.observaciones, s."valorServicio" , a.monto FROM servicios_servicio s INNER JOIN clientes_cliente c ON s."idCliente" = c."idCliente" LEFT JOIN servicios_reparacionimpresora ri ON ri."servicio_id" = s."idServicio" LEFT JOIN servicios_abono a ON a."servicio_id" = s."idServicio" WHERE s."idServicio" = %s
        GROUP BY s."idServicio", c.nombre, s."fechaIngreso", c.direccion, c.telefono,
                 ri.marca, ri.modelo, ri.serial, ri.falla, ri.solucion, s.observaciones, s."valorServicio", a.monto
        """,
            [id_servicio],
        )
    row = cursor.fetchone()
    pdf.cell(150, 10, txt="Orden de Trabajo", ln=True, align="C")
    pdf.ln(-9)
    pdf.set_x(110)
    pdf.set_font("Arial", style="B", size=14)
    pdf.cell(30, 10, txt="N 1231", border=3, ln=True, align="C")
    pdf.set_font("Arial", size=12)
    pdf.ln(4)

    pdf.cell(100, 7, "Cliente:", border=1)
    pdf.cell(95, 7, "Fecha:", border=1)
    pdf.ln()
    pdf.cell(100, 7, "Direccion:", border=1)
    pdf.cell(95, 7, "Telefono:", border=1)
    pdf.ln()
    pdf.cell(100, 7, "Impresora:", border=1)
    pdf.cell(95, 7, "Serial:", border=1)
    pdf.ln()
    pdf.cell(195, 7, "Diagnostico:", border=1)
    pdf.ln()
    pdf.cell(195, 7, "Trabajo a Realizar:", border=1)
    pdf.ln()
    pdf.cell(195, 7, "Observaciones:", border=1)
    pdf.ln(7)
    pdf.set_x(165)
    pdf.cell(40, 7, "Valor:", border=1)
    pdf.ln()
    pdf.set_x(165)
    pdf.cell(40, 7, "Abono:", border=1)
    pdf.ln()
    pdf.set_x(10)
    pdf.cell(40, 7, "Firma del Cliente:_______________", border=0)
    pdf.set_x(85)
    pdf.cell(40, 7, "Firma del Tècnico:_______________", border=0)
    pdf.set_x(165)
    pdf.cell(40, 7, "Saldo:", border=1)
    pdf.ln()

    pdf_bytes = bytes(pdf.output(dest="S"))
    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = 'inline; filename="ejemplo.pdf"'
    return response
