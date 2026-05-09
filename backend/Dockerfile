FROM python:3.11-slim

# System dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies before copying source for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Use /tmp for all writable runtime directories (HF Spaces runs as non-root)
ENV HF_HOME=/tmp/hf_cache \
    TORCH_HOME=/tmp/torch_cache \
    DF_CACHE_HOME=/tmp/df_cache

EXPOSE 7860

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
