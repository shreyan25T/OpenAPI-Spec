import pystache
from constants import selenium_mustache_sample

actions_with_args = ["send_keys", "move_by_offset"]

actions_without_input_strings = ["move_by_offset"]


def generate_code(methods):
    for act in methods["operations"]:
        if act["actionChainFlag"]:
            for chain in act["actionChains"]:
                chain["req_string"] = True
                if chain["action"] in actions_with_args:
                    chain["req_arg"] = True
                if chain["action"] in actions_without_input_strings:
                    chain["req_string"] = False
    print("methods-------------------", methods)
    with open(selenium_mustache_sample, "r") as f:
        template_str = f.read()

    rendered = pystache.render(template_str, methods)
    rendered_str = rendered.replace("&quot;", '"')

    return rendered_str

    # with open(f"generate_codes_file.py", "w") as f:
    #     f.write(rendered_str)

    # print(rendered)
