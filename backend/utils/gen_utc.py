import html
import os
import tempfile
import zipfile

import constants
import pystache
import yaml
from constants import (
    locust_mustache_sample,
    selenium_mustache_sample,
    test_dir,
    test_mustache_sample,
)
from fastapi.responses import FileResponse
from openapi_parser import parse
from utils.parser_utils import (
    camel_to_snake,
    extract_example_from_schema,
    get_schema_payload,
    snake_to_caps,
)


def create_zip_file(zip_folder_path):
    os.makedirs(zip_folder_path, exist_ok=True)
    zip_file_path = os.path.join(zip_folder_path, "test_files.zip")
    if os.path.exists(zip_file_path):
        print("File Present, so Deleting it..")
        os.remove(zip_file_path)

    print("ZIPPING IN")
    with zipfile.ZipFile(zip_file_path, "w") as zipf:
        for folder, _, files in os.walk(zip_folder_path):
            for file in files:
                if ".zip" not in file:
                    zipf.write(os.path.join(folder, file), arcname=file)
    print("ZIPPING OUT")
    return zip_file_path


def create_zip_file_sel(zip_folder_path):
    # Create the directory if it doesn't exist
    os.makedirs(zip_folder_path, exist_ok=True)

    zip_file_path = os.path.join(zip_folder_path, "test_files.zip")
    if os.path.exists(zip_file_path):
        print("File Present, so Deleting it..")
        os.remove(zip_file_path)

    print("ZIPPING IN")
    with zipfile.ZipFile(zip_file_path, "w") as zipf:
        for folder, _, files in os.walk(zip_folder_path):
            for file in files:
                if ".zip" not in file:
                    zipf.write(os.path.join(folder, file), arcname=file)

        zipf.write("generate_codes_file.py", arcname="generate_codes_file.py")
    print("ZIPPING OUT")
    return zip_file_path


def test_case_generator(yaml_file, locust_flag):

    content = parse(yaml_file)
    print("CONTENT", yaml_file)

    with open(test_mustache_sample, "r") as f:
        template_str = f.read()

    if locust_flag is not None:
        with open(locust_mustache_sample, "r") as f:
            template_str = f.read()

    filename = str(content.info.title).lower().replace(" ", "_")
    classname = snake_to_caps(filename)

    test_cases = []
    for path in content.paths:
        for ops in path.operations:
            method = ops.method.value.lower()
            query_params = []
            path_variables = []
            for param in ops.parameters:
                if param.location.value == "query":
                    default_value = param.schema.default
                    example_value = param.schema.example
                    value = default_value or example_value or f"default_{param.name}"
                    query_params.append({"name": param.name, "value": value})
                if param.location.value == "path":
                    default_value = param.schema.default
                    example_value = param.schema.example
                    value = default_value or example_value or f"default_{param.name}"
                    path_variables.append({"name": param.name, "value": value})

            query_param_variables = "\n        ".join(
                [f"{param['name']} = '{param['value']}'" for param in query_params]
            )

            query_string = "&".join(
                [f"{param['name']}={{{param['name']}}}" for param in query_params]
            )

            path_with_dynamic_params = (
                f"{path.url}?" + query_string if query_params else path.url
            )
            path_variable_assignments = "\n        ".join(
                [f"{param['name']} = '{param['value']}'" for param in path_variables]
            )
            example_payload = None
            requestbody = ops.request_body
            if requestbody:
                request_body = requestbody.content
                if "application/json" in request_body[0].type.value:
                    schema = request_body[0].schema
                    example_payload = extract_example_from_schema(schema, content)
            for res in ops.responses:
                if res.content and len(res.content) > 0:
                    type_f, payload_p = get_schema_payload(res.content[0])
                else:
                    type_f, payload_p = "dict", {}

                if locust_flag is not None and (res.code < 200 or res.code >= 300):
                    continue

                test_cases.append(
                    {
                        "path_with_params": path_with_dynamic_params,
                        "method_name": camel_to_snake(ops.operation_id)
                        + "_"
                        + str(res.code),
                        "query_param_variables": query_param_variables,
                        "path_variable_assignments": path_variable_assignments,
                        "statusCode": res.code,
                        "responseObject": payload_p,
                        "responseObjectType": type_f,
                        "statusCode": res.code,
                        "http_method": method,
                        "has_payload": method in ["post", "put"],
                        "payload": example_payload if example_payload else "{}",
                    }
                )
    rendered = pystache.render(
        template_str,
        {
            "class_name": (
                "LocustTestManager" if locust_flag else classname + "TestManager"
            ),
            "test_cases": test_cases,
        },
    )

    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".py") as temp_file:
        temp_file.write(html.unescape(rendered))

    return FileResponse(
        temp_file.name,
        media_type="text/x-python",  # MIME type for Python files
        filename=f"test_{filename}_manager.py",  # Filename to show in the download
    )

    # with open(os.path.join(output_path, f"test_{filename}_manager.py"), "w") as f:
    #     f.write(html.unescape(rendered))


if __name__ == "__main__":
    with open(constants.sample_yaml, "r") as file:
        yaml_data = yaml.safe_load(file)
    test_case_generator(
        "/mnt/d/practice/selenium_test/testcases/AutoGenerate_Testcases/downloads/swagger_case_one.yaml"
    )
