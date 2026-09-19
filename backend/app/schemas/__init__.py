import importlib.util
import os
import sys

# Re-export all schemas from backend/schemas.py
_schemas_py_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "schemas.py")
if os.path.exists(_schemas_py_path):
    spec = importlib.util.spec_from_file_location("root_schemas", _schemas_py_path)
    _mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(_mod)
    for _attr in dir(_mod):
        if not _attr.startswith("_"):
            globals()[_attr] = getattr(_mod, _attr)
