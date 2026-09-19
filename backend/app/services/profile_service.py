import importlib.util
import os

_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "services", "profile_service.py")
if os.path.exists(_path):
    spec = importlib.util.spec_from_file_location("root_profile_service", _path)
    _mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(_mod)
    for _attr in dir(_mod):
        if not _attr.startswith("_"):
            globals()[_attr] = getattr(_mod, _attr)
