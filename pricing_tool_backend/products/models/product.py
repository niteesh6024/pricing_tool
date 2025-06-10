from django.db import models
from .category import Category
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from django.conf import settings

class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    stock_available = models.PositiveIntegerField(default=0)
    units_sold = models.PositiveIntegerField(default=0)
    customer_rating = models.FloatField(default=0.0)
    optimized_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    demand_forecast = models.PositiveIntegerField(null=True, blank=True)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def calculate_demand_forecast(self, days=7):
        """
        Estimate product demand for the next `days` (default: 7) using:
        - sales rate
        - customer rating
        - optimized price influence
        - category trends (optional)
        """
        if self.created_at:
            age_days = (timezone.now() - self.created_at).days or 1
        else:
            age_days = 1

        sales_rate = self.units_sold / age_days
        rating_multiplier = Decimal(1 + ((self.customer_rating - 4) * 0.1))

        # if optimized price is much lower than current price, demand may increase
        price_incentive = Decimal(1.0)
        if self.optimized_price and self.optimized_price < self.selling_price:
            price_drop_ratio = (self.selling_price - self.optimized_price) / self.selling_price
            price_incentive += price_drop_ratio * Decimal(0.5)  # up to +50%

        # category trend multipliers
        category_multiplier = Decimal('1.0')
        if self.category and self.category.name.lower() in ['electronics', 'wearables']:
            category_multiplier = Decimal('1.1')

        # Final forecast
        forecast = Decimal(sales_rate) * Decimal(days) * rating_multiplier * price_incentive * category_multiplier
        return int(forecast)
        

    def calculate_optimized_price(self):
        if self.cost_price <= 0:
            return self.selling_price

        min_margin = Decimal('0.25')
        base_price = self.cost_price * (1 + min_margin)
        if self.created_at:
            age_days = (timezone.now() - self.created_at).days or 1
        else:
            age_days = 1
        sales_rate = self.units_sold / age_days
        demand_factor = sales_rate / (self.stock_available + 1)
        rating_factor = (self.customer_rating - 3) / 2  # -1 to +1

        adjustment = Decimal(1 + (demand_factor * 0.2) + (rating_factor * 0.1))
        optimized = base_price * adjustment

        return min(optimized, self.selling_price).quantize(Decimal('0.01'))

    def save(self, *args, **kwargs):
        # if (timezone.now() - self.updated_at).days >= 1:
        self.optimized_price = self.calculate_optimized_price()
        self.demand_forecast = self.calculate_demand_forecast()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name