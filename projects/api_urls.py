
from django.urls import path

from .api_views import (
    PublicPageView,
    PublicServiceListView,
    PublicProjectListView,
    PublicProjectDetailView,
    AdminServiceViewSet,
    AdminProjectViewSet,
AdminProjectGalleryListCreateView,
AdminProjectGalleryDeleteView,
)
from .api_views import AdminPageSectionViewSet
from .api_views import AdminPageViewSet

admin_page_list = AdminPageViewSet.as_view({
    "get": "list",
    "post": "create",
})
admin_section_list = AdminPageSectionViewSet.as_view({
    "get": "list",
    "post": "create",
})

admin_section_detail = AdminPageSectionViewSet.as_view({
    "get": "retrieve",
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy",
})

admin_page_detail = AdminPageViewSet.as_view({
    "get": "retrieve",
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy",
})


urlpatterns = [
    # Public website APIs
    path(
        "pages/<slug:slug>/",
        PublicPageView.as_view(),
        name="public-page",
    ),
    path(
        "services/",
        PublicServiceListView.as_view(),
        name="public-services",
    ),
    path(
        "projects/",
        PublicProjectListView.as_view(),
        name="public-projects",
    ),
    path(
        "projects/<slug:slug>/",
        PublicProjectDetailView.as_view(),
        name="public-project-detail",
    ),

    # Dashboard service management APIs
    path(
        "admin/services/",
        AdminServiceViewSet.as_view({
            "get": "list",
            "post": "create",
        }),
        name="admin-services",
    ),
    path(
        "admin/services/<int:pk>/",
        AdminServiceViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="admin-service-detail",
    ),

    # Dashboard project management APIs
    path(
        "admin/projects/",
        AdminProjectViewSet.as_view({
            "get": "list",
            "post": "create",
        }),
        name="admin-projects",
    ),
    path(
        "admin/projects/<int:pk>/",
        AdminProjectViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="admin-project-detail",
    ),
path(
    "admin/projects/<int:project_pk>/gallery/",
    AdminProjectGalleryListCreateView.as_view(),
    name="admin-project-gallery",
),
path(
    "admin/projects/<int:project_pk>/gallery/<int:pk>/",
    AdminProjectGalleryDeleteView.as_view(),
    name="admin-project-gallery-delete",
),
path("admin/sections/", admin_section_list, name="admin-section-list"),
path("admin/sections/<int:pk>/", admin_section_detail, name="admin-section-detail"),

path("admin/pages/", admin_page_list, name="admin-page-list"),
path("admin/pages/<int:pk>/", admin_page_detail, name="admin-page-detail"),

]
