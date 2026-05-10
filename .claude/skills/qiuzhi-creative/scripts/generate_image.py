"""
Generate an image via gemini-3-pro-image-preview (Nano Banana Pro).
Usage: python generate_image.py --prompt "..." [--out output.png] [--no-assets]
All images in the assets/ folder are automatically passed as reference images.
"""
import argparse
import base64
import io
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]  # first-cc/
ASSETS = Path(__file__).resolve().parent.parent / "assets"

def load_env():
    env_file = ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, val = line.partition("=")
                os.environ.setdefault(key.strip(), val.strip())

def main():
    load_env()
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit("Error: GEMINI_API_KEY not set. Check .env file.")

    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--out", default="output.png")
    parser.add_argument("--no-assets", action="store_true", help="Skip all assets/ reference images")
    args = parser.parse_args()

    try:
        from google import genai
        from google.genai import types
        from PIL import Image as PILImage
    except ImportError:
        sys.exit("Error: Run `pip install google-genai Pillow` first.")

    client = genai.Client(api_key=api_key)

    contents = [args.prompt]
    if not args.no_assets:
        for img_path in sorted(ASSETS.glob("*.jpg")) + sorted(ASSETS.glob("*.png")):
            with PILImage.open(img_path) as img:
                contents.append(img.copy())
            print(f"Reference: {img_path.name}")

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
        ),
    )

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    image_part = None
    text_parts = []
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            image_part = part
        elif part.text:
            text_parts.append(part.text)

    if image_part:
        data = image_part.inline_data.data
        if isinstance(data, str):
            data = base64.b64decode(data)
        PILImage.open(io.BytesIO(data)).save(out_path)
        print(f"Saved: {out_path.resolve()}")
    else:
        for text in text_parts:
            print(f"Model response: {text}")
        sys.exit("Error: No image returned.")

if __name__ == "__main__":
    main()
