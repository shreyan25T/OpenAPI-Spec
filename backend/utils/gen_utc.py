import os
import yaml
import pystache
from openapi_parser import parse
import zipfile
import constants
from constants import test_mustache_sample, test_dir
from utils.parser_utils import camel_to_snake, get_schema_payload

def create_zip_file(zip_folder_path):
    zip_file_path = os.path.join(zip_folder_path, 'test_files.zip')
    if os.path.exists(zip_file_path):
        print("File Present, so Deleting it..")
        os.remove(zip_file_path)
    
    print("ZIPPING IN")
    with zipfile.ZipFile(zip_file_path, 'w') as zipf:
        for folder, _, files in os.walk(zip_folder_path):
            for file in files:
                if '.zip' not in file:
                    zipf.write(os.path.join(folder, file), arcname=file)
    print("ZIPPING OUT")
    return zip_file_path

def test_case_generator(yaml_file,output_path):

    content = parse(yaml_file)
    print("CONTENT",yaml_file)

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

        with open(os.path.join(output_path, f'test_{tag.name}_manager.py'), 'w') as f:
            f.write(rendered)


if __name__ == '__main__':
    with open(constants.sample_yaml, "r") as file:
        yaml_data = yaml.safe_load(file)
    test_case_generator("/mnt/d/practice/selenium_test/testcases/AutoGenerate_Testcases/downloads/swagger_case_one.yaml")
