def get_schema_payload(data):
    """
    get schema payload iterates into the schema object and convert the schema object to dict

    :param data: schema data parsed from swagger yaml file
    :return:
    """
    payload = {}
    type_flag = "dict"
    if data.schema.type.name == "ARRAY":
        type_flag = "list"
        iterator = data.schema.items.properties
    elif data.schema.type.name == "OBJECT":
        iterator = data.schema.properties
    else:
        iterator = []

    for i in iterator:
        payload[i.name] = str(i.schema.example)
        if i.schema.type.name == "OBJECT":
            inner_dict = {}
            for k in i.schema.properties:
                inner_dict[k.name] = str(k.schema.example)
            payload[i.name] = inner_dict
        if i.schema.type.name == "ARRAY" and i.schema.items.type.name == "OBJECT":
            inner_list = []
            for k in i.schema.items.properties:
                inner_list.append(str(k.schema.example))
            payload[i.name] = inner_list

    return type_flag, payload


def snake_to_caps(string):
    """converting the snakecase word to capitalize word e.g. snake_case >> SnakeCase"""
    return "".join(x.capitalize() for x in string.split("_"))


def camel_to_snake(string):
    """converting the camelcase word to snakecase word e.g. camelCase >> camel_case"""
    converted_method_name = string[0].lower() + string[1:]
    return "".join(
        ["_" + c.lower() if c.isupper() else c for c in converted_method_name]
    ).lstrip("_")


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
