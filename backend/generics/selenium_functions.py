from selenium import webdriver
import time

# Setup WebDriver
def open():
    driver = webdriver.Chrome()
    return driver

def send_keys(element, keys):
    """Simulate sending keys to an element"""
    element.send_keys(keys)

def click_element(element):
    """Simulate clicking on an element"""
    element.click()