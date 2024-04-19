import os
import yaml
import pystache
from openapi_parser import parse

import constants
from constants import test_mustache_sample, test_dir
from utils.parser_utils import camel_to_snake, get_schema_payload


def test_case_generator(yaml_file):
    content = parse(yaml_file)

    with open(test_mustache_sample, 'r') as f:
        template_str = f.read()

    for tag in content.tags:
        methods = {
            'packageName': str(tag.name).capitalize(),
            'className': str(tag.name).capitalize() + 'TestManager',
            'models': {
                'modelName': str(tag.name).capitalize(), 'modelVariable': tag.name,
                'modelExample': {'id': 1, 'name': 'jack'}
            }
        }
        for path in content.paths:
            if str(path.url).startswith('/' + tag.name):
                for ops in path.operations:
                    if ops.method.value + 'Operations' in methods:
                        item = methods[ops.method.value + 'Operations']
                        for res in ops.responses:
                            if res.content and len(res.content) > 0:
                                type_f, payload_p = get_schema_payload(res.content[0])
                            else:
                                type_f, payload_p = 'dict', {}

                            item.append({
                                "url": path.url,
                                "functionName": camel_to_snake(ops.operation_id) + "_" + str(res.code),
                                "statusCode": res.code,
                                "responseObject": payload_p,
                                "responseObjectType": type_f
                            })
                    else:
                        methods[ops.method.value + 'Operations'] = []

        rendered = pystache.render(template_str, methods)

        with open(os.path.join(test_dir, f'test_{tag.name}_manager.py'), 'w') as f:
            f.write(rendered)


if __name__ == '__main__':
    with open(constants.sample_yaml, "r") as file:
        yaml_data = yaml.safe_load(file)
    test_case_generator("/mnt/d/practice/selenium_test/testcases/AutoGenerate_Testcases/downloads/swagger_case_one.yaml")
