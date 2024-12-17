import os
import yaml
import pystache
from openapi_parser import parse
import zipfile
import constants
import html
from constants import test_mustache_sample, test_dir,locust_mustache_sample,selenium_mustache_sample
from utils.parser_utils import camel_to_snake, get_schema_payload

def create_zip_file(zip_folder_path):
    os.makedirs(zip_folder_path, exist_ok=True)
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

def create_zip_file_sel(zip_folder_path):
    # Create the directory if it doesn't exist
    os.makedirs(zip_folder_path, exist_ok=True)

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

        zipf.write('generate_codes_file.py', arcname='generate_codes_file.py')
    print("ZIPPING OUT")
    return zip_file_path

def resolve_ref(ref, spec):
    """
    Resolve $ref to its corresponding definition in the OpenAPI spec using openapi_parser.
    """
    if ref.startswith("#/"):
        keys = ref.lstrip("#/").split("/")
        resolved = spec.raw
        for key in keys:
            resolved = resolved[key]
        return resolved
    raise ValueError(f"Unsupported $ref format: {ref}")


def extract_example_from_schema(schema, spec):
    """
    Generate an example payload from the schema using openapi_parser if available.
    """
    # Check if the schema has a reference ($ref)
    if hasattr(schema, "ref") and schema.ref:  
        resolved_schema = resolve_ref(schema.ref, spec)
        return extract_example_from_schema(resolved_schema, spec)

    # Handle direct examples in the schema
    if hasattr(schema, "example") and schema.example:
        return schema.example

    # Handle default values in the schema
    if hasattr(schema, "default") and schema.default:
        return schema.default

    # Handle examples (dictionary of examples)
    if hasattr(schema, "examples") and schema.examples:
        return next(iter(schema.examples.values())).get("value", {})

    # Handle object schemas with properties
    if hasattr(schema, "type") and schema.type.value == "object" and hasattr(schema, "properties"):
        return {
            prop.name: extract_example_from_schema(prop.schema, spec)
            for prop in schema.properties
        }

    # Handle array schemas
    if hasattr(schema, "type") and schema.type.value == "array" and hasattr(schema, "items"):
        return [extract_example_from_schema(schema.items, spec)]

    # If no specific example is found, return an empty structure
    return {}

def convert_openapi_to_locust(spec):
    test_cases = []
    for path in spec.paths:
        for operation in path.operations:
            method = operation.method.value.lower()
            query_params = []
            path_variables = []
            for param in operation.parameters:
                if param.location.value == "query":
                    # Get default or example value from the API spec
                    default_value = param.schema.default
                    example_value = param.schema.example
                    value = default_value or example_value or f"default_{param.name}"
                    query_params.append({"name": param.name, "value": value})
                if param.location.value == "path":
                    # Get default or example value from the API spec
                    default_value = param.schema.default
                    example_value = param.schema.example
                    value = default_value or example_value or f"default_{param.name}"
                    path_variables.append({"name": param.name, "value": value})

            # Generate variable assignments for query parameters
            query_param_variables = "\n        ".join([ 
                f"{param['name']} = '{param['value']}'" 
                for param in query_params 
            ])

            query_string = "&".join([ 
                f"{param['name']}={{{param['name']}}}" for param in query_params 
            ])
            
            path_with_dynamic_params = f"{path.url}?" + query_string if query_params else path.url
            
            path_variable_assignments = "\n        ".join([
                f"{param['name']} = '{param['value']}'"
                for param in path_variables
            ])
            # Extract example payload for POST/PUT
            example_payload = None
            requestbody = operation.request_body
            if requestbody:
                request_body = requestbody.content
                if "application/json" in request_body[0].type.value:
                    schema = request_body[0].schema
                    example_payload = extract_example_from_schema(schema, spec)

            # Add test case details
            test_cases.append({
                "path": path,
                "path_with_params": path_with_dynamic_params,
                "query_param_variables": query_param_variables,
                "path_variable_assignments": path_variable_assignments,
                "http_method": method,
                "method_name": operation.operation_id,
                "has_payload": method in ['post', 'put'],
                "payload": example_payload if example_payload else '{}',
            })
    return test_cases 

def test_case_generator(yaml_file,output_path,locust_flag):

    content = parse(yaml_file)
    print("CONTENT",yaml_file)

    if locust_flag is not None:
        with open(locust_mustache_sample, 'r') as f:
            template_str = f.read()
            
        test_cases = convert_openapi_to_locust(content)
        rendered = pystache.render(template_str, {
                "class_name": "LocustTestUser",
                "test_cases": test_cases,
            })
        # with open(os.path.join(output_path, 'locustfile.py'), 'w') as f:
        #     f.write(html.unescape(rendered))
        return html.unescape(rendered)

        # print(f"Locust test file generated: {output_path}")
            
    else:
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

                                if locust_flag is not None and res.code != 200:
                                    continue

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
            return "success"

if __name__ == '__main__':
    with open(constants.sample_yaml, "r") as file:
        yaml_data = yaml.safe_load(file)
    test_case_generator("/mnt/d/practice/selenium_test/testcases/AutoGenerate_Testcases/downloads/swagger_case_one.yaml")
