import os
from pathlib import Path

# Project Directory to perform the checks
root_dir = str(Path(__file__).parent)
mustaches_dir = os.path.join(root_dir, r"mustaches")
test_dir = os.path.join(root_dir, r"tests")
sample_dir = os.path.join(root_dir, r"samples")
download_dir = os.path.join(root_dir, r"downloads")

# Mustache test file
test_mustache_sample = os.path.join(mustaches_dir, r'test_models_sample.mustache')
sample_yaml = os.path.join(sample_dir, r'swagger_case_three.yaml')

# Output Summary file path
test_summary = os.path.join(root_dir, "test_results.xlsx")

