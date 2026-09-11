import os
import multiprocessing

port = os.getenv("PORT", "10000")
bind = f"0.0.0.0:{port}"
timeout = 120
workers = 1
threads = 2
preload_app = False
