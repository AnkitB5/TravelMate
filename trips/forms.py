# trips/forms.py
from django import forms
from .models import Trip

class TripForm(forms.ModelForm):
    class Meta:
        model = Trip
        fields = [
            'destination',
            'travel_start',
            'travel_end',
            'activities',
            'packing_list',
            'meeting_schedule',
        ]
        widgets = {
            'travel_start': forms.DateInput(
                attrs={
                    'type': 'date',
                    'class': 'form-control',
                }
            ),
            'travel_end': forms.DateInput(
                attrs={
                    'type': 'date',
                    'class': 'form-control',
                }
            ),
        }
