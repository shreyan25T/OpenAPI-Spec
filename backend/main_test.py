import pystache
from constants import selenium_mustache_sample

def test_case_generator(methods):
    with open(selenium_mustache_sample, 'r') as f:
        template_str = f.read()

    rendered = pystache.render(template_str, methods)

    print(rendered)


if __name__ == '__main__':
    test_case_generator(
        {"operations": [
            {
                "actions": "function", "inputs": "a, 1, 3", "outputs": "c,b", }
        ]
        }
    )