def get_schema_payload(data):
    """
    get schema payload iterates into the schema object and convert the schema object to dict

    :param data: schema data parsed from swagger yaml file
    :return:
    """
    payload = {}
    type_flag = 'dict'
    if data.schema.type.name == 'ARRAY':
        type_flag = 'list'
        iterator = data.schema.items.properties
    elif data.schema.type.name == 'OBJECT':
        iterator = data.schema.properties
    else:
        iterator = []

    for i in iterator:
        payload[i.name] = str(i.schema.example)
        if i.schema.type.name == 'OBJECT':
            inner_dict = {}
            for k in i.schema.properties:
                inner_dict[k.name] = str(k.schema.example)
            payload[i.name] = inner_dict
        if i.schema.type.name == 'ARRAY' and i.schema.items.type.name == 'OBJECT':
            inner_list = []
            for k in i.schema.items.properties:
                inner_list.append(str(k.schema.example))
            payload[i.name] = inner_list

    return type_flag, payload


def snake_to_caps(string):
    """ converting the snakecase word to capitalize word e.g. snake_case >> SnakeCase """
    return ''.join(x.capitalize() for x in string.split('_'))


def camel_to_snake(string):
    """ converting the camelcase word to snakecase word e.g. camelCase >> camel_case """
    converted_method_name = string[0].lower() + string[1:]
    return ''.join(['_' + c.lower() if c.isupper() else c for c in converted_method_name]).lstrip('_')
