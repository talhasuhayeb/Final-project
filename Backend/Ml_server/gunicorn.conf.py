import os

bind = f"0.0.0.0:{os.getenv('PORT', '10000')}"
timeout = 120
workers = 1
threads = 2
