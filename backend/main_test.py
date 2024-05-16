import pystache


def test_case_generator(methods):
    with open(
            r"C:\Users\simran.maurya\Desktop\OpenAPI-Spec\backend\mustaches\selenium_models_sample.mustache",
            'r') as f:
        template_str = f.read()

    rendered = pystache.render(template_str, methods)

    print(rendered)
    print(rendered)


if __name__ == '__main__':
    test_case_generator(
        {"operations": [
            {
                "actions": "function", "inputs": "a, 1, 3", "outputs": "c,b", }
        ]
        }
    )