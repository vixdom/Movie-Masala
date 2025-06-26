#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background with rounded corners
    margin = size // 20
    bg_color = (139, 21, 56, 255)  # #8B1538
    draw.rounded_rectangle([margin, margin, size-margin, size-margin], 
                          radius=size//8, fill=bg_color)
    
    # Gold border
    border_margin = size // 15
    border_color = (255, 215, 0, 255)  # #FFD700
    draw.rounded_rectangle([border_margin, border_margin, size-border_margin, size-border_margin],
                          radius=size//10, outline=border_color, width=size//64)
    
    # Clapboard
    clap_width = size // 3
    clap_height = size // 5
    clap_x = (size - clap_width) // 2
    clap_y = size // 3
    
    # Clapboard base
    draw.rectangle([clap_x, clap_y, clap_x + clap_width, clap_y + clap_height],
                  fill=(45, 45, 45, 255))
    
    # Clapboard top
    top_height = clap_height // 4
    draw.rectangle([clap_x, clap_y - top_height, clap_x + clap_width, clap_y],
                  fill=(255, 215, 0, 255))
    
    # Clapboard stripes
    stripe_width = clap_width // 6
    for i in range(0, clap_width, stripe_width * 2):
        draw.rectangle([clap_x + i, clap_y - top_height, 
                       clap_x + i + stripe_width, clap_y],
                      fill=(26, 26, 26, 255))
    
    # Text "MM"
    try:
        font_size = size // 12
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "MM"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = (size - text_width) // 2
    text_y = size - size // 4
    
    draw.text((text_x, text_y), text, fill=(255, 215, 0, 255), font=font)
    
    return img

# Create icons
try:
    print("Creating PNG icons...")
    
    # Create 192x192 icon
    icon_192 = create_icon(192)
    icon_192.save('client/public/icon-192.png', 'PNG')
    
    # Create 512x512 icon
    icon_512 = create_icon(512)
    icon_512.save('client/public/icon-512.png', 'PNG')
    
    # Create Apple touch icon (180x180)
    icon_180 = create_icon(180)
    icon_180.save('client/public/apple-touch-icon.png', 'PNG')
    
    print("PNG icons created successfully!")
    
except ImportError:
    print("PIL not available, creating base64 encoded icons...")
    
    # Create a simple base64 encoded PNG as fallback
    import base64
    
    # Minimal 1x1 PNG in base64 that we can scale
    minimal_png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    # For now, create placeholder files
    with open('client/public/icon-192.png', 'wb') as f:
        f.write(base64.b64decode(minimal_png))
    
    print("Created placeholder icons - will need proper icons for production")

except Exception as e:
    print(f"Error creating icons: {e}")