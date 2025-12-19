from django.db import models
from clientes.models import Cliente


# --------------------
# Servicio (general)
# --------------------


class Servicio(models.Model):

    TIPO_SERVICIO_CHOICES = [
        ('PC', 'Reparación de Computador'),
        ('IMP', 'Reparación de Impresora'),
        ('TON', 'Recarga de Tóner'),
    ]

    ESTADO_CHOICES = [
        ('REC', 'Recibido'),
        ('PRO', 'En proceso'),
        ('TER', 'Terminado'),
        ('ENT', 'Entregado'),
        ('NRE', 'No realizado'),
    ]

    idServicio = models.AutoField(primary_key=True)

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        db_column='idCliente',
        related_name='servicios'
    )

    tipoServicio = models.CharField(max_length=3, choices=TIPO_SERVICIO_CHOICES)
    fechaIngreso = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=3, choices=ESTADO_CHOICES, default='REC')
    observaciones = models.TextField(blank=True, null=True)
    valorServicio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    def total_abonado(self):
        return self.abonos.aggregate(
            total=models.Sum('monto')
        )['total'] or Decimal('0.00')

    def saldo_pendiente(self):
        return self.valorServicio - self.total_abonado()

    def __str__(self):
        return f"Servicio #{self.idServicio} - {self.get_tipoServicio_display()}"

class Abono(models.Model):

    idAbono = models.AutoField(primary_key=True)
    servicio = models.ForeignKey(
        Servicio,
        on_delete=models.CASCADE,
        related_name='abonos'
    )

    monto = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Abono ${self.monto}"

# --------------------
# Detalles
# --------------------
class ReparacionPC(models.Model):

    servicio = models.OneToOneField(
        Servicio,
        on_delete=models.CASCADE,
        related_name='pc'
    )

    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100, blank=True, null=True)

    serial = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Número de serie del equipo'
    )

    problema = models.TextField()
    solucion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"PC {self.marca} - {self.serial or 'Sin serial'}"

class ReparacionImpresora(models.Model):

    servicio = models.OneToOneField(
        Servicio,
        on_delete=models.CASCADE,
        related_name='impresora'
    )

    marca = models.CharField(
        max_length=100
    )

    modelo = models.CharField(
        max_length=100
    )

    serial = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Número de serie de la impresora'
    )

    falla = models.TextField()

    solucion = models.TextField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.marca} {self.modelo} - {self.serial or 'Sin serial'}"

class RecargaToner(models.Model):
    servicio = models.OneToOneField(Servicio, on_delete=models.CASCADE)
    modelo_toner = models.CharField(max_length=100)
