from django.db import models


class Cliente(models.Model):
    TIPO_DOCUMENTO_CHOICES = [
        ("DNI", "DNI"),
        ("RUC", "RUC"),
        ("PAS", "Pasaporte"),
        # Agrega más si necesitas
    ]

    idCliente = models.AutoField(primary_key=True)
    tipoDocumento = models.CharField(max_length=10, choices=TIPO_DOCUMENTO_CHOICES)
    nombre = models.CharField(max_length=100)
    numeroDocumento = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)
    ciudad = models.CharField(max_length=50)
    direccion = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.nombre} ({self.numeroDocumento})"
