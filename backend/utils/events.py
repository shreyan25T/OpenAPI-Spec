import os.path

from constants import download_dir, test_dir


def app_startup():
    if not os.path.exists(download_dir): os.mkdir(download_dir)
    if not os.path.exists(test_dir): os.mkdir(test_dir)

