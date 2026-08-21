import pdb
import locale
import sys
from django.utils import timezone
from datetime import datetime
from multiprocessing import connection
from django.db import connection
from fpdf import FPDF
from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed
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
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404


def obtener_estado_completo(abreviatura):
    """
    Convierte la abreviatura del estado a su representación completa.
    """
    estados_mapa = {
        "REC": "Recibido",
        "PRO": "En proceso",
        "TER": "Terminado",
        "ENT": "Entregado",
        "NRE": "No realizado",
        "GAR": "Garantía",
    }
    return estados_mapa.get(abreviatura, abreviatura)


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

    servicio = Servicio.objects.create(
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

    # Manejo del abono
    abono = request.POST.get("abono")
    if not abono or abono.strip() == "":
        abono = "0"

    Abono.objects.create(servicio=servicio, monto=Decimal(abono))

    return JsonResponse(
        {
            "success": True,
            "message": "✅ Ingreso registrado exitosamente.",
            "id": servicio.idServicio,
            "tipo": servicio.tipoServicio,
        }
    )


def ReparacionImpresora_data(request):
    reparaciones = (
        ReparacionImpresora.objects
        .select_related("servicio__cliente")
        .exclude(servicio__estado="ENT")  # excluye entregados
    )
    data = []
    hoy = timezone.localtime(timezone.now()).date()  # fecha actual en Colombia

    for r in reparaciones:
        fecha_ingreso = timezone.localtime(r.servicio.fechaIngreso)
        fecha_colombia = fecha_ingreso.strftime("%d/%m/%Y %I:%M:%S %p")

        dias_transcurridos = (hoy - fecha_ingreso.date()).days + 1

        dias_es = {
            "Monday": "Lunes",
            "Tuesday": "Martes",
            "Wednesday": "Miércoles",
            "Thursday": "Jueves",
            "Friday": "Viernes",
            "Saturday": "Sábado",
            "Sunday": "Domingo"
        }


        dia_semana = fecha_ingreso.strftime("%A")
        dia_semana_es = dias_es[dia_semana]


        data.append(
            {
                "id": r.id,
                "fecha_ingreso": fecha_colombia,
                "dia_semana": dia_semana_es,
                "dias_en_reparacion": dias_transcurridos,
                "idservicio": r.servicio_id,
                "marca": r.marca,
                "modelo": r.modelo,
                "serial": r.serial,
                "cliente": r.servicio.cliente.nombre,
                "telefono": r.servicio.cliente.telefono,
                "estado": r.servicio.get_estado_display(),
            }
        )
    return JsonResponse({"data": data})

def obtener_servicioimpresora(request, id):
    """
    Devuelve los datos de una reparación de impresora en formato JSON.
    """
    if request.method == "GET":
        try:
            reparacion = get_object_or_404(ReparacionImpresora.objects.select_related("servicio__cliente"), pk=id)
            return JsonResponse(
                {
                    "success": True,
                    "servicio": {
                        "id": reparacion.id,
                        "marca": reparacion.marca,
                        "modelo": reparacion.modelo,
                        "serial": reparacion.serial,
                        "cliente": reparacion.servicio.cliente.nombre,
                        "diagnostico": reparacion.falla,
                        "solucion": reparacion.solucion,
                        "observaciones": reparacion.servicio.observaciones,
                        "valorServicio": str(reparacion.servicio.valorServicio),
                        "abonos": str(reparacion.servicio.total_abonado()),
                        "saldo": str(reparacion.servicio.saldo_pendiente()),
                        "estado": reparacion.servicio.get_estado_display(),
                    },
                }
            )
        except ReparacionImpresora.DoesNotExist:
            return JsonResponse(
                {"success": False, "message": "Servicio no encontrado"}, status=404
            )
    else:
        return JsonResponse(
            {"success": False, "message": "Método no permitido"}, status=405
        )
def recibo_pdf_impresora(request, id):

    pdf = FPDF(orientation="P", unit="mm", format=(216, 140))
    pdf.add_page()
    pdf.image("static/images/logo.jpg", x=20, y=7, w=92)

    pdf.set_font("Arial", style="I", size=13)
    pdf.ln(5)
    pdf.cell(170, 10, txt="Carrera 30 #28-43", ln=True, align="R")
    pdf.ln(-4)
    pdf.cell(190, 10, txt="Cels : 318-553 9043 / 318-873 3880", ln=True, align="R")
    pdf.ln(-2)

    id_servicio = id  # variable externa

    with connection.cursor() as cursor:
        cursor.execute(
            """
        SELECT s."idServicio" AS numeroingreso, s."fechaEntrega" AS fechaentrega, s.estado AS estado, c.nombre AS cliente, s."fechaIngreso", c.direccion, c.telefono, ri.marca, ri.modelo, ri.serial, ri.falla, ri.solucion, s.observaciones, s."valorServicio" , a.monto FROM servicios_servicio s INNER JOIN clientes_cliente c ON s."idCliente" = c."idCliente" LEFT JOIN servicios_reparacionimpresora ri ON ri."servicio_id" = s."idServicio" LEFT JOIN servicios_abono a ON a."servicio_id" = s."idServicio" WHERE s."idServicio" = %s
        GROUP BY s."idServicio", c.nombre, s."fechaIngreso", c.direccion, c.telefono,
                 ri.marca, ri.modelo, ri.serial, ri.falla, ri.solucion, s.observaciones, s."valorServicio", a.monto
        """,
            [id_servicio],
        )
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        datos = dict(zip(columns, row))


    if datos["fechaentrega"] is None:
        fecha_entrega_formateada = "Entrega pendiente"
    else:
        fecha = datos["fechaentrega"]  # datetime con tz
        fecha_local = timezone.localtime(fecha)  # ajusta a TIME_ZONE configurado
        fecha_entrega_formateada = fecha_local.strftime("%d-%m-%Y %I:%M %p")
    pdf.ln(8)
    pdf.set_font("Arial", style="B", size=15)
    pdf.cell(195, 10, txt=f"ORDEN DE TRABAJO N° {datos['numeroingreso']}", border=1, ln=True, align="C")
    pdf.set_font("Arial", size=12)
    pdf.cell(90, 7, f"Cliente: {datos['cliente']}", border=1)
    fecha_ingreso_formateada = datos["fechaIngreso"].strftime("%d-%m-%Y %I:%M %p")
    pdf.cell(52, 7, f"FI : {fecha_ingreso_formateada}", border=1)
    pdf.cell(53, 7, f"FE : {fecha_entrega_formateada}", border=1)
    pdf.ln()
    pdf.cell(100, 7, f"Direccion: {datos['direccion']}", border=1)
    pdf.cell(95, 7, f"Telefono: {datos['telefono']}", border=1)
    pdf.ln()
    pdf.cell(65, 7, f"Impresora: {datos['marca']} {datos['modelo']}", border=1)
    pdf.cell(65, 7, f"Serial: {datos['serial']}", border=1)
    pdf.cell(65, 7, f"Estado: {obtener_estado_completo(datos['estado'])}", border=1)
    pdf.ln()
    pdf.cell(195, 7, f"Diagnostico: {datos['falla']}", border=1)
    pdf.ln()
    pdf.cell(195, 7, f"Trabajo a Realizar: {datos['solucion']}", border=1)
    pdf.ln()
    pdf.cell(195, 7, f"Observaciones: {datos['observaciones']}", border=1)
    pdf.ln(12)
    pdf.set_x(30)
    valor = datos["valorServicio"]
    pdf.cell(60, 7, f"Valor: ${valor:,.0f}".replace(",", "."), border=1)

    saldo = datos["valorServicio"] - (datos["monto"] or 0)
    abono = datos["monto"] or 0
    pdf.cell(40, 7, f"Abono:${abono:,.0f}".replace(",", "."), border=1)
    pdf.cell(40, 7, f"Saldo: ${saldo:,.0f}".replace(",", "."), border=1)
    pdf.ln(13)
    pdf.set_x(50)
    pdf.cell(70, 7, "Firma del Cliente:", border=0)
    pdf.cell(40, 7, "Firma del Tècnico:", border=0)
    pdf.ln(5)
    pdf.set_x(43)
    pdf.cell(70, 7, "___________________", border=0)
    pdf.cell(70, 7, "___________________", border=0)
    pdf.set_x(85)

    pdf_bytes = pdf.output(dest="S").encode("latin1")  # clásico fpdf
    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = 'inline; filename="ejemplo.pdf"'
    return response


def recibo_pdf_computador(request, id):

    pdf = FPDF(orientation="P", unit="mm", format=(216, 140))
    pdf.add_page()
    pdf.image("static/images/logo.jpg", x=65, y=5, w=85)

    pdf.set_font("Arial", style="I", size=13)
    pdf.ln(18)
    pdf.cell(195, 10, txt="Carrera 30 #28-43", ln=True, align="C")
    pdf.ln(-4)
    pdf.cell(195, 10, txt="Cels : 318-553 9043 / 318-873 3880", ln=True, align="C")
    pdf.ln(-2)

    id_servicio = id  # variable externa

    with connection.cursor() as cursor:
        cursor.execute(
            """
        SELECT s."idServicio" AS numero, c.nombre AS cliente, s."fechaIngreso", c.direccion, c.telefono, rpc.marca, rpc.modelo, rpc.serial, rpc.problema, rpc.solucion, s.observaciones, s."valorServicio" , a.monto FROM servicios_servicio s INNER JOIN clientes_cliente c ON s."idCliente" = c."idCliente" LEFT JOIN servicios_reparacionpc rpc ON rpc."servicio_id" = s."idServicio" LEFT JOIN servicios_abono a ON a."servicio_id" = s."idServicio" WHERE s."idServicio" = %s
        GROUP BY s."idServicio", c.nombre, s."fechaIngreso", c.direccion, c.telefono,
                 rpc.marca, rpc.modelo, rpc.serial, rpc.problema, rpc.solucion, s.observaciones, s."valorServicio", a.monto
        """,
            [id_servicio],
        )
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        datos = dict(zip(columns, row))
    pdf.cell(150, 10, txt="Orden de Trabajo:", ln=True, align="C")
    pdf.ln(-9)
    pdf.set_x(110)
    pdf.set_font("Arial", style="B", size=14)
    pdf.cell(30, 8, txt=f"N {datos['numero']}", border=3, ln=True, align="C")
    pdf.set_font("Arial", size=12)
    pdf.ln(4)
    pdf.cell(100, 7, f"Cliente: {datos['cliente']}", border=1)
    fecha_formateada = datos["fechaIngreso"].strftime("%d-%m-%Y %I:%M")
    pdf.cell(95, 7, f"Fecha: {fecha_formateada}", border=1)
    pdf.ln()
    pdf.cell(100, 7, f"Direccion: {datos['direccion']}", border=1)
    pdf.cell(95, 7, f"Telefono: {datos['telefono']}", border=1)
    pdf.ln()
    pdf.cell(100, 7, f"Computador: {datos['marca']} {datos['modelo']}", border=1)
    pdf.cell(95, 7, f"Serial: {datos['serial']}", border=1)
    pdf.ln()
    pdf.cell(195, 7, f"Diagnostico: {datos['problema']}", border=1)
    pdf.ln()
    pdf.cell(195, 7, f"Trabajo a Realizar: {datos['solucion']}", border=1)
    pdf.ln()
    pdf.cell(195, 7, f"Observaciones: {datos['observaciones']}", border=1)
    pdf.ln(8)
    pdf.set_x(165)
    valor = datos["valorServicio"] or 0
    pdf.cell(40, 7, f"Valor: ${valor:,.0f}".replace(",", "."), border=1)
    pdf.ln()
    pdf.set_x(165)
    saldo = datos["valorServicio"] - (datos["monto"] or 0)
    abono = datos["monto"] or 0
    pdf.cell(40, 7, f"Abono:${abono:,.0f}".replace(",", "."), border=1)
    pdf.ln()
    pdf.set_x(10)
    pdf.cell(40, 7, "Firma del Cliente:_______________", border=0)
    pdf.set_x(85)
    pdf.cell(40, 7, "Firma del Tècnico:_______________", border=0)
    pdf.set_x(165)
    pdf.cell(40, 7, f"Saldo: ${saldo:,.0f}".replace(",", "."), border=1)
    pdf.ln()
    pdf_bytes = pdf.output(dest="S").encode("latin1")  # clásico fpdf
    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = 'inline; filename="ejemplo.pdf"'
    return response


def editar_servicio_impresora(request, id):
    if request.method in ["PUT", "POST"]:
        print("Request body:", request.body)
        try:
            servicio = ReparacionImpresora.objects.get(pk=id)
        except ReparacionImpresora.DoesNotExist:
            return JsonResponse(
                {"success": False, "message": "❌ Servicio no encontrado"}, status=404
            )

        if request.body and request.content_type == "application/json":
            import json
            data = json.loads(request.body)
            servicio.marca = data.get("marca", servicio.marca)
            servicio.modelo = data.get("modelo", servicio.modelo)
            servicio.serial = data.get("serial", servicio.serial)
            servicio.falla = data.get("diagnostico", servicio.falla)
            servicio.solucion = data.get("trabajoarealizar", servicio.solucion)
            servicio.servicio.observaciones = data.get(
                "observaciones", servicio.servicio.observaciones
            )
            servicio.servicio.valorServicio = Decimal(
                data.get("valorServicio", servicio.servicio.valorServicio)
            )
            servicio.servicio.estado = data.get("estado", servicio.servicio.estado)
        else:  # Si viene como form-data (POST)
            servicio.marca = request.POST.get("marca", servicio.marca)
            servicio.modelo = request.POST.get("modelo", servicio.modelo)
            servicio.serial = request.POST.get("serial", servicio.serial)
            servicio.falla = request.POST.get("falla", servicio.falla)
            servicio.solucion = request.POST.get("solucion", servicio.solucion)
            servicio.servicio.observaciones = request.POST.get(
                "observaciones", servicio.servicio.observaciones
            )
            servicio.servicio.valorServicio = Decimal(
                request.POST.get("valorServicio", servicio.servicio.valorServicio)
                or 0
            )
            servicio.servicio.estado = request.POST.get("estado", servicio.servicio.estado)

        if servicio.servicio.fechaEntrega is None and servicio.servicio.estado == "ENT":
            servicio.servicio.fechaEntrega = timezone.now()

        servicio.save()
        servicio.servicio.save()
        return JsonResponse(
            {"success": True, "message": "✅ Servicio actualizado correctamente"}
        )

    return HttpResponseNotAllowed(["PUT", "POST"])

def recibo_pdf_toner(request, id):

    pdf = FPDF(orientation="P", unit="mm", format=(216, 140))
    pdf.add_page()
    pdf.image("static/images/logo.jpg", x=65, y=5, w=85)

    pdf.set_font("Arial", style="I", size=13)
    pdf.ln(18)
    pdf.cell(195, 10, txt="Carrera 30 #28-43", ln=True, align="C")
    pdf.ln(-4)
    pdf.cell(195, 10, txt="Cels : 318-553 9043 / 318-873 3880", ln=True, align="C")
    pdf.ln(-2)

    id_servicio = id  # variable externa

    with connection.cursor() as cursor:
        cursor.execute(
            """
        SELECT s."idServicio" AS numero, c.nombre AS cliente, s."fechaIngreso", c.direccion, c.telefono, rt.modelo_toner, s.observaciones, s."valorServicio" , a.monto FROM servicios_servicio s INNER JOIN clientes_cliente c ON s."idCliente" = c."idCliente" LEFT JOIN servicios_recargatoner rt ON rt."servicio_id" = s."idServicio" LEFT JOIN servicios_abono a ON a."servicio_id" = s."idServicio" WHERE s."idServicio" = %s
        GROUP BY s."idServicio", c.nombre, s."fechaIngreso", c.direccion, c.telefono,
                 rt.modelo_toner, s.observaciones, s."valorServicio", a.monto
        """,
            [id_servicio],
        )
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        datos = dict(zip(columns, row))
    pdf.cell(150, 10, txt="Orden de Trabajo:", ln=True, align="C")
    pdf.ln(-9)
    pdf.set_x(110)
    pdf.set_font("Arial", style="B", size=14)
    pdf.cell(30, 8, txt=f"N {datos['numero']}", border=3, ln=True, align="C")
    pdf.set_font("Arial", size=12)
    pdf.ln(4)
    pdf.cell(100, 7, f"Cliente: {datos['cliente']}", border=1)
    fecha_formateada = datos["fechaIngreso"].strftime("%d-%m-%Y %I:%M")
    pdf.cell(95, 7, f"Fecha: {fecha_formateada}", border=1)
    pdf.ln()
    pdf.cell(100, 7, f"Direccion: {datos['direccion']}", border=1)
    pdf.cell(95, 7, f"Telefono: {datos['telefono']}", border=1)
    pdf.ln()
    pdf.cell(195, 7, f"Modelo del Toner: {datos['modelo_toner']}", border=1)
    pdf.ln()

    pdf.ln(8)
    pdf.set_x(165)
    valor = datos["valorServicio"] or 0
    pdf.cell(40, 7, f"Valor: ${valor:,.0f}".replace(",", "."), border=1)
    pdf.ln()
    pdf.set_x(165)
    saldo = datos["valorServicio"] - (datos["monto"] or 0)
    abono = datos["monto"] or 0
    pdf.cell(40, 7, f"Abono:${abono:,.0f}".replace(",", "."), border=1)
    pdf.ln()
    pdf.set_x(10)
    pdf.set_x(165)
    pdf.cell(40, 7, f"Saldo: ${saldo:,.0f}".replace(",", "."), border=1)
    pdf.ln()
    pdf_bytes = pdf.output(dest="S").encode("latin1")  # clásico fpdf
    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = 'inline; filename="ejemplo.pdf"'
    return response
