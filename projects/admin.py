
from django.contrib import admin
from .models import (
    Page,
    PageSection,
    MenuItem,
    ServiceDivision,
    Project,
    ProjectGalleryImage,
    QuoteInquiry,
)


class PageSectionInline(admin.StackedInline):
    model = PageSection
    extra = 1
    ordering = ("order",)


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "status", "updated_at")
    list_filter = ("status",)
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PageSectionInline]


@admin.register(PageSection)
class PageSectionAdmin(admin.ModelAdmin):
    list_display = (
        "title", "page", "section_type", "order", "is_visible"
    )
    list_filter = ("section_type", "is_visible")
    search_fields = ("title", "page__title")


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("title", "url", "parent", "order", "is_visible")
    list_filter = ("is_visible",)
    search_fields = ("title",)


class ProjectGalleryInline(admin.TabularInline):
    model = ProjectGalleryImage
    extra = 1


@admin.register(ServiceDivision)
class ServiceDivisionAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "description")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "service",
        "client_name",
        "completion_year",
        "is_featured",
        "is_published",
    )
    list_filter = ("service", "is_featured", "is_published")
    search_fields = ("title", "client_name", "location")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProjectGalleryInline]


@admin.register(QuoteInquiry)
class QuoteInquiryAdmin(admin.ModelAdmin):
    list_display = ("full_name", "company", "email", "submitted_at")
    search_fields = ("full_name", "company", "email")
    list_filter = ("submitted_at", "service")
