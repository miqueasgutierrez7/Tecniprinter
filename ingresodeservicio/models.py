from django.db import models

class Servicio(models.Model):

    # Tipo de dispositivo
    TIPO_CHOICES = [
        ('Computadora', 'Computadora'),
        ('Impresora', 'Impresora'),
    ]
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='Computadora')

    # Datos del dispositivo
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=100)
    serial = models.CharField(max_length=100, unique=True)

    # Fechas
    fecha_ingreso = models.DateField(auto_now_add=True)

    # Datos del servicio
    diagnostico = models.TextField(blank=True, null=True)
    trabajo_realizar = models.TextField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)

    # Valores económicos
    valor = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    abono = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.tipo} - {self.marca} {self.modelo} (Serial: {self.serial})"# Create your models here.
