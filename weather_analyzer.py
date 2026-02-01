import re
from datetime import datetime, timedelta
from predictor import get_trek_safety

class WeatherAnalyzer:
    """Handles date extraction and multi-day weather predictions for treks"""
    
    # Trek durations in days (based on typical itineraries)
    TREK_DURATIONS = {
        "Annapurna Base Camp": 10,
        "Annapurna Circuit": 15,
        "Everest Base Camp": 12,
        "Gokyo Lakes": 12,
        "Gosaikunda Lakes": 7,
        "Helambu Trek": 6,
        "Kanchenjunga BC": 20,
        "Langtang Valley": 7,
        "Makalu Base Camp": 18,
        "Manaslu Circuit": 14,
        "Mardi Himal": 5,
        "Nar Phu Valley": 14,
        "Pikey Peak": 6,
        "Rara Lake Trek": 10,
        "Rolwaling Trek": 16,
        "Three Passes Trek": 18,
        "Tilicho Lake": 10,
        "Tsum Valley": 12,
        "Upper Dolpo": 21,
        "Upper Mustang": 12
    }
    
    # Month name mappings
    MONTH_MAP = {
        'january': 1, 'jan': 1, 
        'february': 2, 'feb': 2, 
        'march': 3, 'mar': 3,
        'april': 4, 'apr': 4, 
        'may': 5, 
        'june': 6, 'jun': 6,
        'july': 7, 'jul': 7, 
        'august': 8, 'aug': 8, 
        'september': 9, 'sep': 9, 'sept': 9,
        'october': 10, 'oct': 10, 
        'november': 11, 'nov': 11, 
        'december': 12, 'dec': 12
    }
    
    def __init__(self, user_message):
        self.user_message = user_message.lower()
        self.trek_name = self._detect_trek()
        self.trek_duration = self.TREK_DURATIONS.get(self.trek_name, 10)
        self.month = None
        self.day = None
        self.is_range = False
        
        # Get current date for relative date calculations
        from datetime import datetime
        self.current_date = datetime.now()
        
    def _detect_trek(self):
        """Detect which trek the user is asking about"""
        msg = self.user_message
        
        # Check for specific trek keywords (order matters - check specific before general)
        if "three passes" in msg or "3 passes" in msg:
            return "Three Passes Trek"
        elif "everest" in msg or "ebc" in msg:
            return "Everest Base Camp"
        elif "annapurna circuit" in msg or "ac trek" in msg:
            return "Annapurna Circuit"
        elif "annapurna base camp" in msg or "abc" in msg or "annapurna sanctuary" in msg:
            return "Annapurna Base Camp"
        elif "gokyo" in msg:
            return "Gokyo Lakes"
        elif "gosaikunda" in msg or "gosainkunda" in msg:
            return "Gosaikunda Lakes"
        elif "helambu" in msg:
            return "Helambu Trek"
        elif "kanchenjunga" in msg or "kanchanjunga" in msg:
            return "Kanchenjunga BC"
        elif "langtang" in msg:
            return "Langtang Valley"
        elif "makalu" in msg:
            return "Makalu Base Camp"
        elif "manaslu" in msg:
            return "Manaslu Circuit"
        elif "mardi" in msg:
            return "Mardi Himal"
        elif "nar phu" in msg or "narphu" in msg:
            return "Nar Phu Valley"
        elif "pikey" in msg:
            return "Pikey Peak"
        elif "rara" in msg:
            return "Rara Lake Trek"
        elif "rolwaling" in msg:
            return "Rolwaling Trek"
        elif "tilicho" in msg:
            return "Tilicho Lake"
        elif "tsum" in msg:
            return "Tsum Valley"
        elif "dolpo" in msg:
            return "Upper Dolpo"
        elif "mustang" in msg:
            return "Upper Mustang"
        
        # Default to Annapurna Base Camp if no specific trek detected
        return "Annapurna Base Camp"
    
    def extract_date(self):
        """Extract date information from user message"""
        # Check for relative dates FIRST (today, tomorrow, next week)
        if self._check_relative_date():
            return True
        
        # Check for week/month ranges
        self._check_week_range()
        
        # If no range found, check for specific dates
        if not self.month:
            self._check_specific_date()
        
        # Check for entire month queries
        if not self.month:
            self._check_month_only()
        
        return self.month is not None
    
    def _check_relative_date(self):
        """Check for relative date expressions like 'today', 'tomorrow', 'next week'"""
        from datetime import timedelta
        
        msg = self.user_message
        
        # Today
        if re.search(r'\btoday\b', msg):
            self.month = self.current_date.month
            self.day = self.current_date.day
            return True
        
        # Tomorrow
        if re.search(r'\btomorrow\b', msg):
            tomorrow = self.current_date + timedelta(days=1)
            self.month = tomorrow.month
            self.day = tomorrow.day
            return True
        
        # Day after tomorrow
        if re.search(r'\bday after tomorrow\b', msg):
            day_after = self.current_date + timedelta(days=2)
            self.month = day_after.month
            self.day = day_after.day
            return True
        
        # This week / this weekend
        if re.search(r'\bthis (week|weekend)\b', msg):
            self.month = self.current_date.month
            self.day = self.current_date.day
            self.is_range = True
            return True
        
        # Next week
        if re.search(r'\bnext week\b', msg):
            next_week = self.current_date + timedelta(days=7)
            self.month = next_week.month
            self.day = next_week.day
            self.is_range = True
            return True
        
        # Next month
        if re.search(r'\bnext month\b', msg):
            if self.current_date.month == 12:
                self.month = 1
            else:
                self.month = self.current_date.month + 1
            self.day = 1
            self.is_range = True
            return True
        
        # In X days (e.g., "in 3 days", "in 5 days")
        days_pattern = re.search(r'\bin (\d+) days?\b', msg)
        if days_pattern:
            num_days = int(days_pattern.group(1))
            future_date = self.current_date + timedelta(days=num_days)
            self.month = future_date.month
            self.day = future_date.day
            return True
        
        # In X weeks (e.g., "in 2 weeks")
        weeks_pattern = re.search(r'\bin (\d+) weeks?\b', msg)
        if weeks_pattern:
            num_weeks = int(weeks_pattern.group(1))
            future_date = self.current_date + timedelta(weeks=num_weeks)
            self.month = future_date.month
            self.day = future_date.day
            self.is_range = True
            return True
        
        return False
    
    def _check_week_range(self):
        """Check for patterns like 'first week of April', 'early May', etc."""
        week_pattern = r'(first|second|third|fourth|last|early|mid|late)\s+(week\s+of\s+)?(' + '|'.join(self.MONTH_MAP.keys()) + ')'
        week_match = re.search(week_pattern, self.user_message)
        
        if week_match:
            week_indicator = week_match.group(1)
            month_name = week_match.group(3)
            self.month = self.MONTH_MAP[month_name]
            self.is_range = True
            
            # Determine starting day based on week indicator
            week_starts = {
                'first': 1, 'early': 1,
                'second': 8,
                'third': 15, 'mid': 15,
                'fourth': 22, 'late': 22, 'last': 22
            }
            self.day = week_starts.get(week_indicator, 1)
    
    def _check_specific_date(self):
        """Check for specific date patterns like '15 March' or 'March 15'"""
        for month_name, month_val in self.MONTH_MAP.items():
            # Pattern 1: "15 March"
            pattern1 = rf'(\d{{1,2}})\s+{month_name}'
            match1 = re.search(pattern1, self.user_message)
            
            if match1:
                self.day = int(match1.group(1))
                self.month = month_val
                return
            
            # Pattern 2: "March 15"
            pattern2 = rf'{month_name}\s+(\d{{1,2}})'
            match2 = re.search(pattern2, self.user_message)
            
            if match2:
                self.day = int(match2.group(1))
                self.month = month_val
                return
        
        # Pattern 3: "3/15" or "03/15" (month/day)
        date_pattern = re.search(r'(\d{1,2})/(\d{1,2})', self.user_message)
        if date_pattern:
            self.month = int(date_pattern.group(1))
            self.day = int(date_pattern.group(2))
    
    def _check_month_only(self):
        """Check for entire month queries like 'in April', 'during March'"""
        for month_name, month_val in self.MONTH_MAP.items():
            if re.search(rf'\b(in|during)\s+{month_name}\b', self.user_message):
                self.month = month_val
                self.day = 15  # Use mid-month as reference
                self.is_range = True
                return
    
    def get_trek_prediction(self):
        """Get weather predictions for the trek period"""
        if not self.month or not self.day:
            return None
        
        predictions = []
        
        # For ranges or trek duration questions, check multiple days
        if self.is_range or "week" in self.user_message or "month" in self.user_message:
            # Sample every 3 days throughout the trek
            for i in range(0, self.trek_duration, 3):
                try:
                    current_date = datetime(2026, self.month, self.day) + timedelta(days=i)
                    pred = get_trek_safety(self.trek_name, current_date.month, current_date.day)
                    if pred:
                        predictions.append(pred)
                except ValueError:
                    # Handle invalid dates (e.g., Feb 30)
                    continue
        else:
            # Single day check
            pred = get_trek_safety(self.trek_name, self.month, self.day)
            if pred:
                predictions.append(pred)
        
        if not predictions:
            return None
        
        # Analyze predictions
        return self._analyze_predictions(predictions)
    
    def _analyze_predictions(self, predictions):
        """Analyze multiple day predictions and return summary"""
        safe_count = sum(1 for p in predictions if p['label'] == 'Safe')
        caution_count = sum(1 for p in predictions if p['label'] == 'Caution')
        dangerous_count = sum(1 for p in predictions if p['label'] == 'Dangerous')
        
        avg_temp = sum(p['temp'] for p in predictions) / len(predictions)
        avg_wind = sum(p['wind'] for p in predictions) / len(predictions)
        avg_rain = sum(p['rain'] for p in predictions) / len(predictions)
        
        # Determine overall status
        total = len(predictions)
        if dangerous_count > total / 2:
            overall_status = "Dangerous"
        elif safe_count > total / 2:
            overall_status = "Safe"
        else:
            overall_status = "Caution"
        
        return {
            'trek_name': self.trek_name,
            'month': self.month,
            'day': self.day,
            'duration': self.trek_duration,
            'overall_status': overall_status,
            'safe_days': safe_count,
            'caution_days': caution_count,
            'dangerous_days': dangerous_count,
            'total_days_checked': total,
            'avg_temp': round(avg_temp, 1),
            'avg_wind': round(avg_wind, 1),
            'avg_rain': round(avg_rain, 1)
        }
    
    def get_context_for_gemini(self):
        """Generate the context string to inject into Gemini's system prompt"""
        result = self.get_trek_prediction()
        
        if not result:
            # If no ML data available, provide general seasonal guidance
            return (
                f"\n\n[SEASONAL GUIDANCE]: Historical weather data is not available for "
                f"{self.trek_name} on {self.month}/{self.day}. This could be due to limited "
                f"data for this specific date or trek. Provide general trekking advice based on "
                f"typical Himalayan weather patterns for this season. Be honest that you don't "
                f"have specific ML predictions for this date, but offer helpful seasonal insights. "
                f"DO NOT make up specific temperature or wind numbers.\n\n"
            )
        
        # Print debug info to terminal
        self._print_debug(result)
        
        # Create context for Gemini
        context = (
            f"\n\n[CRITICAL SAFETY DATA]: For {result['trek_name']} starting around "
            f"{result['month']}/{result['day']}, the Machine Learning model analyzed "
            f"{result['total_days_checked']} days and predicts: {result['overall_status']}. "
            f"Breakdown: {result['safe_days']} Safe days, {result['caution_days']} Caution days, "
            f"{result['dangerous_days']} Dangerous days. "
            f"Average Stats: Temp {result['avg_temp']}°C, Wind {result['avg_wind']} km/h, "
            f"Rain {result['avg_rain']}mm. "
            f"YOU MUST provide specific safety advice based on this {result['duration']}-day trek analysis.\n\n"
        )
        
        return context
    
    def _print_debug(self, result):
        """Print debug information to terminal"""
        print(f"\n{'='*60}")
        print(f"🤖 DEBUG: XGBoost Predictions for {result['trek_name']}")
        print(f"📅 Period: Starting {result['month']}/{result['day']} ({result['duration']} days)")
        print(f"🎯 Overall Status: {result['overall_status']}")
        print(f"📊 Breakdown: Safe={result['safe_days']}, Caution={result['caution_days']}, Dangerous={result['dangerous_days']}")
        print(f"🌡️  Avg Temperature: {result['avg_temp']}°C")
        print(f"💨 Avg Wind Speed: {result['avg_wind']} km/h")
        print(f"🌧️  Avg Rainfall: {result['avg_rain']}mm")
        print(f"{'='*60}\n")