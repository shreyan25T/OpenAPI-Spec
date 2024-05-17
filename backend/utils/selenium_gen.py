import pystache
from constants import selenium_mustache_sample


def generate_code(methods):
    with open(selenium_mustache_sample, 'r') as f:
        template_str = f.read()

    rendered = pystache.render(template_str, methods)
    rendered_str = rendered.replace("&quot;", '"')

    with open(f'generate_codes_file.py', 'w') as f:
        f.write(rendered_str)

    print(rendered)
