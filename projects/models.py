
from django.db import models
from django.utils.text import slugify


class Page(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["title"]


class PageSection(models.Model):
    SECTION_TYPES = [
        ("hero", "Hero"),
        ("text", "Text"),
        ("image", "Image"),
        ("services", "Services"),
        ("projects", "Projects"),
        ("gallery", "Gallery"),
        ("about", "About"),
        ("testimonials", "Testimonials"),
        ("contact", "Contact"),
        ("cta", "Call to Action"),
    ]

    page = models.ForeignKey(
        Page,
        on_delete=models.CASCADE,
        related_name="sections",
    )
    section_type = models.CharField(
        max_length=30,
        choices=SECTION_TYPES,
    )
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="page_sections/",
        blank=True,
        null=True,
    )
    background_color = models.CharField(max_length=30, blank=True)
    text_color = models.CharField(max_length=30, blank=True)
    custom_settings = models.JSONField(default=dict, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.page.title} - {self.get_section_type_display()}"

    class Meta:
        ordering = ["order", "id"]


class MenuItem(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=500, blank=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="children",
    )
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["order", "id"]




class ServiceDivision(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    short_tagline = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(
        upload_to="services/",
        blank=True,
        null=True,
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["order", "title"]


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)

    service = models.ForeignKey(
        ServiceDivision,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="projects",
    )

    client_name = models.CharField(max_length=200, blank=True)
    event_or_venue = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=200, blank=True)
    stand_area = models.CharField(max_length=100, blank=True)
    completion_year = models.PositiveIntegerField(null=True, blank=True)

    hero_image = models.ImageField(
        upload_to="projects/",
        blank=True,
        null=True,
    )

    summary = models.TextField(blank=True)
    challenge = models.TextField(blank=True)
    solution = models.TextField(blank=True)

    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-created_at"]


class ProjectGalleryImage(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="gallery_images",
    )

    image = models.ImageField(upload_to="project_gallery/")
    caption = models.CharField(max_length=300, blank=True)
    is_wide = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Image for {self.project.title}"

    class Meta:
        ordering = ["order", "id"]


class QuoteInquiry(models.Model):
    full_name = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)

    service = models.ForeignKey(
        ServiceDivision,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    event_date = models.DateField(null=True, blank=True)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.email}"

    class Meta:
        ordering = ["-submitted_at"]
