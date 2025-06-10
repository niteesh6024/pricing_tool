# Price Optimization Tool

## Overview

This project is a full-stack web application for product management and price optimization, built with Django (backend) and React (frontend). It allows users to register as buyers, sellers, or admins, manage products, view demand forecasts, and get AI-powered product summaries.

---

## Features

- **User Authentication:** JWT-based login/register with roles (admin, seller, buyer).
- **Product Management:** Sellers and admins can create, update, view, and delete products.
- **Category Management:** Products are organized by categories. Managed by admins
- **Demand Forecasting:** Visualize demand forecasts and selling prices with charts.
- **Optimized Pricing:** Can see the optiimized price to the selling price
- **AI Summarization:** Get concise summaries of selected product data.
- **Role-Based Access:** Permissions restrict actions based on user roles.

---

## Setup Instructions

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL as DB

### Backend Setup

1. **Set up environment:**
   ```sh
   git clone https://github.com/niteesh6024/pricing_tool.git
   cd pricing_tool/pricing_tool_backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configure the database:**
    - Spin up postgress db with these details
        POSTGRES_DB=pricing_tool
        POSTGRES_USER=pricing_user
        POSTGRES_PASSWORD=pricing_tool
        PORT=5432
   - You can simply spin up docker container 
    ```sh
    docker run -d \
        --name pricing_postgres \
        -e POSTGRES_DB=pricing_tool \
        -e POSTGRES_USER=pricing_user \
        -e POSTGRES_PASSWORD=pricing_tool \
        -p 5432:5432 \
        postgres
    ```

3. **Apply migrations:**
   ```sh
   python manage.py migrate
   ```

4. **Run the backend server:**
   ```sh
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```sh
   cd ../pricing_tool-frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the frontend:**
   ```sh
   npm start
   ```

4. **Access the app:**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Configuration

- **Email verification:**  
  After creating an account, you will receive an email to activate your account. By default, email sending is disabled for simplicity—the verification URL will be logged in the backend console.  
  To verify your account, copy the URL from the console and open it in your browser or send a GET request to it.

  To enable real email sending, update these settings in `settings.py`:
  ```python
  EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
  EMAIL_HOST_USER = "your_email@example.com"
  EMAIL_HOST_PASSWORD = 'your_password'

- **Enable/Disable Summarizer:**  
  In `pricing_tool_backend/settings.py`, set:
  ```python
  ENABLE_SUMMARIZER = True  # or False
  ```
- **JWT Token Lifetime:**  
  Adjust in `settings.py` under `SIMPLE_JWT`.

---

## Testing

1. **Create an admin account:**  
   - Register as an admin user.
   - Check the backend logs for the email verification link and use it to activate your account.
   - Log in as admin and add some product categories.

2. **Create a seller account:**  
   - Register as a seller user.
   - Verify the account using the link from the backend logs.
   - Log in as seller and add some products under the categories created by the admin.

3. **Test demand forecasting and summarization:**  
   - Use the toggle button to enable demand forecasting.
   - Select one or more products to view demand forecast charts and AI-generated summaries.

4. **Test price optimization:**  
   - Navigate to the "Price Optimization" tab to view optimized price suggestions for your products.

## Assignment Outcomes

- Implement secure, role-based authentication and authorization.
- Allow sellers/admins to manage products and categories.
- Provide demand forecasting and price optimization features.
- Integrate an AI summarizer for product analytics.
- Ensure a responsive, user-friendly frontend with clear navigation and data visualization.
- Use best practices for API design, permissions, and frontend-backend integration.

---

## Notes

- The summarizer feature uses a transformer model and may require significant memory; it can be toggled in settings.


