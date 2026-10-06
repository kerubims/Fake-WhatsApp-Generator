import base64
import os

def to_base64(filepath):
    if not os.path.exists(filepath): return None
    ext = filepath.split('.')[-1]
    mime = 'image/png' if ext == 'png' else 'image/jpeg'
    with open(filepath, 'rb') as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode('utf-8')

bg_b64 = to_base64('backbround.jpg')
input_b64 = to_base64('input.png')

if bg_b64:
    with open('style.css', 'r', encoding='utf-8') as f:
        css = f.read()
    css = css.replace("url('backbround.jpg')", f"url('{bg_b64}')")
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Inlined backbround.jpg in style.css")

if input_b64:
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    html = html.replace('src="input.png"', f'src="{input_b64}"')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Inlined input.png in index.html")
