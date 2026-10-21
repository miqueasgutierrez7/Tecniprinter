
from django.test import TestCase
from django.contrib.auth import get_user_model

from .models import Cliente


class ClientesViewsTest(TestCase):

    def setUp(self):
        # Crear usuario para las pruebas
        User = get_user_model()

        self.usuario = User.objects.create_user(
            username="usuario_prueba",
            password="ClavePrueba123!"
        )

        # Iniciar sesión con el usuario de prueba
        self.client.force_login(self.usuario)

        # Crear un cliente de prueba
        self.cliente = Cliente.objects.create(
            tipoDocumento="CC",
            nombre="Juan Pérez",
            numeroDocumento="TEST10001",
            telefono="3001234567",
            correo="juan@example.com",
            ciudad="Cali",
            direccion="Calle 10"
        )

    def test_crear_cliente_de_prueba(self):
        # Comprobar que se creó un cliente
        self.assertEqual(Cliente.objects.count(), 1)

        # Comprobar los datos del cliente
        self.assertEqual(self.cliente.nombre, "Juan Pérez")
        self.assertEqual(
            self.cliente.numeroDocumento,
            "TEST10001"
        )

        # Comprobar que el usuario inició sesión
        self.assertTrue(self.client.session)

