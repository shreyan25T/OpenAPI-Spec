import ast

# Testing the django sample urls file to get the URLS & Views
with open(r'C:\Users\sivaramakrishnan.g\PycharmProjects\Django'
          r'Application\app\optimiser\urls.py', 'r') as file:
    code = file.read()

tree = ast.parse(code)

urlpatterns = []
for node in tree.body:
    if isinstance(node, ast.Assign) and isinstance(node.value, ast.List):
        if len(node.targets) > 0 and node.targets[0].id == 'urlpatterns':
            for element in node.value.elts:
                if isinstance(element, ast.Call) and len(element.args) > 1:
                    urlpatterns.append({
                        "path": element.args[0].s,
                        "view": element.args[1].func.value.attr
                    })

# Print URLs and view methods
for items in urlpatterns:
    print(f"URL: {items['path']}, View Method: {items['view']}")
