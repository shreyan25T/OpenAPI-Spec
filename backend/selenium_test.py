from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

received_data = [{'id': 1, 'by': 'NAME', 'byInput': 'email', 'action': 'send_keys', 'actionInput': 'exampleInput'},
                 {'id': 2, 'by': 'ID', 'byInput': 'exampleInputPassword1', 'action': 'send_keys', 'actionInput': 'password'}]

def create_sel_func(url,received_data):
    chrome_options = Options()
    service_obj = Service("C:\\Users\\simran.maurya\\Desktop\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")

    driver = webdriver.Chrome(service=service_obj)
    driver.get("https://rahulshettyacademy.com/angularpractice/")
    # driver.get(url)

    for data in received_data:
        # Extracting the locator strategy and value from each dictionary
        locator_strategy = getattr(By, data["by"])
        locator_value = data["byInput"]

        # Using the locator strategy and value to find the element
        elem = driver.find_element(locator_strategy, locator_value)

        elem.clear()
        elem.send_keys(data["actionInput"])

    assert "No results found." not in driver.page_source
    driver.close()
