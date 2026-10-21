
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.views.generic import RedirectView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Login
    path(
        "login/",
        auth_views.LoginView.as_view(
            template_name="registration/login.html"
        ),
        name="login"
    ),
    path(
        "logout/",
        auth_views.LogoutView.as_view(),
        name="logout"
    ),

    # Redirigir la página principal al login
    path("", RedirectView.as_view(pattern_name="login", permanent=False)),

    # Rutas de las aplicaciones
    path("", include("clientes.urls")),
    path("", include("servicios.urls")),
]
