from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

shortWait = 10

def main():
    chrome_options = Options()
    service_obj = Service(r"")
    driver = webdriver.Chrome(service=service_obj)
    driver.get("")
    driver.find_element(By.CSS_SELECTOR, "username").get_attribute("id")
    driver.find_element(By.CLASS_NAME, "username").get_text()
    time.sleep(2)
    driver.close()

if __name__ == '__main__':
    main()
