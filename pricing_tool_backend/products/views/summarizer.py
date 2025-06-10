from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..permissions import IsSeller, IsAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.conf import settings
from transformers import pipeline

if getattr(settings, "ENABLE_SUMMARIZER", False):
    # Initialize the summarization pipeline using a pre-trained model
    summarizer_pipeline = pipeline("text2text-generation", model="google/flan-t5-base")

    def summarize_with_prompt(context):
        prompt = """
                You are a product analytics assistant. Summarize product data like this:

                Input:
                Smartwatch costs ₹70.00, sells at ₹149.99, sold 130 units, forecast demand is 180.
                Fitness Tracker costs ₹30.00, sells at ₹59.99, sold 180 units, forecast demand is 225.

                Output:
                The Fitness Tracker has the highest forecasted demand at 225 units, while the Smartwatch has the lowest at 180 units. Consider increasing stock for the Fitness Tracker and reviewing Smartwatch pricing to boost sales.

                Now summarize this:
                """

        full_input = f"{prompt}\n\n{context}"
        print("Full input for summarization:", full_input)
        summary = summarizer_pipeline(full_input, max_length=150, do_sample=False)
        return summary[0]['generated_text']
else:
    summarize_with_prompt = None

class SummarizeView(APIView):
    def post(self, request):
        if not getattr(settings, "ENABLE_SUMMARIZER", False):
            raise PermissionDenied("Summarizer is disabled by admin.")
        context = request.data.get('context')

        if not context:
            return Response({'error': 'Context is required'}, status=400)

        summary = summarize_with_prompt(context)
        return Response({'summary': summary}, status=status.HTTP_200_OK)

    def get_permissions(self):
        if self.request.method == "POST":
            permission_class = IsAdmin | IsSeller
            return [permission_class()]
        return [IsAuthenticated()]
    

