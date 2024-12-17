import html
import json
import tempfile

import pystache
import yaml
from openapi_parser import parse


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
    if (
        hasattr(schema, "type")
        and schema.type.value == "object"
        and hasattr(schema, "properties")
    ):
        return {
            prop.name: extract_example_from_schema(prop.schema, spec)
            for prop in schema.properties
        }

    # Handle array schemas
    if (
        hasattr(schema, "type")
        and schema.type.value == "array"
        and hasattr(schema, "items")
    ):
        return [extract_example_from_schema(schema.items, spec)]

    # If no specific example is found, return an empty structure
    return {}


def convert_openapi_to_locust(openapi_file, template_file, output_file):
    # Load and parse the OpenAPI YAML file into a dictionary
    with open(openapi_file, "r") as f:
        openapi_content = yaml.safe_load(f)

    # Save the dictionary to a temporary file for OpenAPI parser to parse
    with tempfile.NamedTemporaryFile(
        mode="w", delete=False, suffix=".yaml"
    ) as temp_file:
        yaml.dump(openapi_content, temp_file)
        temp_file_path = temp_file.name  # Get the temporary file path

    # Parse the OpenAPI file with the OpenAPI parser
    spec = parse(temp_file_path)

    # Extract paths and methods
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
            # Extract example payload for POST/PUT
            example_payload = None
            requestbody = operation.request_body
            if requestbody:
                request_body = requestbody.content
                if "application/json" in request_body[0].type.value:
                    schema = request_body[0].schema
                    example_payload = extract_example_from_schema(schema, spec)

            # Add test case details
            test_cases.append(
                {
                    "path": path,
                    "path_with_params": path_with_dynamic_params,
                    "query_param_variables": query_param_variables,
                    "path_variable_assignments": path_variable_assignments,
                    "http_method": method,
                    "method_name": operation.operation_id,
                    "has_payload": method in ["post", "put"],
                    "payload": example_payload if example_payload else "{}",
                }
            )

    # Render the Mustache template
    with open(template_file, "r") as f:
        template_content = f.read()

    rendered = pystache.render(
        template_content,
        {
            "class_name": "LocustTestUser",
            "test_cases": test_cases,
        },
    )

    # Write the rendered output to a file
    with open(output_file, "w") as f:
        f.write(html.unescape(rendered))

    print(f"Locust test file generated: {output_file}")


# Usage
openapi_file = "swagger.yaml"  # Path to your OpenAPI file
template_file = "locust_test.mustache"  # Path to your Mustache template
output_file = "locust_test.py"  # Output Locust test file
convert_openapi_to_locust(openapi_file, template_file, output_file)
