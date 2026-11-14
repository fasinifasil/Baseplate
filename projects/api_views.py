
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .serializers import (
    PageSerializer,
    ServiceDivisionSerializer,
    ProjectSerializer,
    AdminProjectSerializer,
)
from .models import PageSection
from .serializers import AdminPageSectionSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Page
from .serializers import AdminPageSerializer


from .models import Page, ServiceDivision, Project, ProjectGalleryImage
from .models import Page, ServiceDivision, Project
from .serializers import (
    PageSerializer,
    ServiceDivisionSerializer,
    ProjectSerializer,
)

from .serializers import (
    PageSerializer,
    ServiceDivisionSerializer,
    ProjectSerializer,
    AdminProjectSerializer,
    AdminProjectGalleryImageSerializer,
)

class PublicPageView(generics.RetrieveAPIView):
    serializer_class = PageSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Page.objects.filter(status="published")


class PublicServiceListView(generics.ListAPIView):
    serializer_class = ServiceDivisionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ServiceDivision.objects.filter(
            is_active=True
        ).order_by("order", "id")


class PublicProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Project.objects.filter(
            is_published=True
        ).select_related("service").prefetch_related(
            "gallery_images"
        )


class PublicProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Project.objects.filter(
            is_published=True
        ).select_related("service").prefetch_related(
            "gallery_images"
        )


class AdminServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceDivisionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = ServiceDivision.objects.all().order_by("order", "id")

class AdminProjectViewSet(viewsets.ModelViewSet):
    serializer_class = AdminProjectSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    queryset = Project.objects.all().select_related(
        "service"
    ).prefetch_related(
        "gallery_images"
    ).order_by("-created_at")




class AdminProjectGalleryListCreateView(generics.ListCreateAPIView):
    serializer_class = AdminProjectGalleryImageSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return ProjectGalleryImage.objects.filter(
            project_id=self.kwargs["project_pk"]
        ).order_by("order", "id")

    def perform_create(self, serializer):
        project = generics.get_object_or_404(
            Project,
            pk=self.kwargs["project_pk"],
        )
        serializer.save(project=project)


class AdminProjectGalleryDeleteView(generics.DestroyAPIView):
    serializer_class = AdminProjectGalleryImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProjectGalleryImage.objects.filter(
            project_id=self.kwargs["project_pk"]
        )



class AdminPageViewSet(viewsets.ModelViewSet):
    serializer_class = AdminPageSerializer
    permission_classes = [IsAuthenticated]
    queryset = Page.objects.all().order_by("-updated_at")


class AdminPageSectionViewSet(viewsets.ModelViewSet):
    serializer_class = AdminPageSectionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    queryset = PageSection.objects.all().order_by("page_id", "order", "id")

    def get_queryset(self):
        queryset = super().get_queryset()

        page_id = self.request.query_params.get("page_id")

        if page_id:
            queryset = queryset.filter(page_id=page_id)

        return queryset