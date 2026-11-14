from .models import PageSection
from rest_framework import serializers
from rest_framework import serializers
from .models import Page, PageSection
from rest_framework import serializers
from .models import (
    Page,
    PageSection,
    ServiceDivision,
    Project,
    ProjectGalleryImage,
)


class PageSectionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PageSection
        fields = [
            "id",
            "section_type",
            "title",
            "subtitle",
            "description",
            "image_url",
            "background_color",
            "text_color",
            "custom_settings",
            "order",
            "is_visible",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return None


class PageSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = [
            "id",
            "title",
            "slug",
            "meta_title",
            "meta_description",
            "sections",
        ]

    def get_sections(self, obj):
        sections = obj.sections.filter(is_visible=True).order_by("order", "id")
        return PageSectionSerializer(
            sections,
            many=True,
            context=self.context,
        ).data



class ServiceDivisionSerializer(serializers.ModelSerializer):
    cover_image = serializers.ImageField(
        required=False,
        allow_null=True,
        write_only=True,
    )
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = ServiceDivision
        fields = [
            "id",
            "title",
            "slug",
            "short_tagline",
            "description",
            "cover_image",
            "cover_image_url",
            "order",
            "is_active",
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get("request")

        if obj.cover_image:
            url = obj.cover_image.url
            return request.build_absolute_uri(url) if request else url

        return None


class ProjectGalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectGalleryImage
        fields = [
            "id",
            "image_url",
            "caption",
            "is_wide",
            "order",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return None


class ProjectSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(
        source="service.title",
        read_only=True,
        allow_null=True,
    )
    hero_image_url = serializers.SerializerMethodField()
    gallery_images = ProjectGalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "service",
            "service_title",
            "client_name",
            "event_or_venue",
            "location",
            "stand_area",
            "completion_year",
            "hero_image_url",
            "summary",
            "challenge",
            "solution",
            "is_featured",
            "gallery_images",
        ]

    def get_hero_image_url(self, obj):
        request = self.context.get("request")
        if obj.hero_image:
            url = obj.hero_image.url
            return request.build_absolute_uri(url) if request else url
        return None



class AdminProjectSerializer(serializers.ModelSerializer):
    hero_image = serializers.ImageField(
        required=False,
        allow_null=True,
        write_only=True,
    )

    hero_image_url = serializers.SerializerMethodField()

    service_title = serializers.CharField(
        source="service.title",
        read_only=True,
        allow_null=True,
    )

    gallery_images = ProjectGalleryImageSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "service",
            "service_title",
            "client_name",
            "event_or_venue",
            "location",
            "stand_area",
            "completion_year",
            "hero_image",
            "hero_image_url",
            "summary",
            "challenge",
            "solution",
            "is_featured",
            "is_published",
            "gallery_images",
        ]

    def get_hero_image_url(self, obj):
        request = self.context.get("request")

        if obj.hero_image:
            url = obj.hero_image.url
            return request.build_absolute_uri(url) if request else url

        return None



class AdminProjectGalleryImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(write_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectGalleryImage
        fields = [
            "id",
            "image",
            "image_url",
            "caption",
            "is_wide",
            "order",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if obj.image:
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url

        return None






class AdminPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = [
            "id",
            "title",
            "slug",
            "meta_title",
            "meta_description",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class AdminPageSectionSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PageSection
        fields = [
            "id",
            "page",
            "section_type",
            "title",
            "subtitle",
            "description",
            "image",
            "image_url",
            "background_color",
            "text_color",
            "custom_settings",
            "order",
            "is_visible",
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            image_url = obj.image.url
            return request.build_absolute_uri(image_url) if request else image_url
        return None
