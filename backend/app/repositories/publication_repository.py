import importlib.util
import os

_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "repositories", "publication_repository.py")
if os.path.exists(_path):
    spec = importlib.util.spec_from_file_location("root_pub_repo", _path)
    _mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(_mod)
    for _attr in dir(_mod):
        if not _attr.startswith("_"):
            globals()[_attr] = getattr(_mod, _attr)
