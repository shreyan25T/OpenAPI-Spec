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
    service_obj = Service("C:\\Users\\simran.maurya\\Desktop\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
    driver = webdriver.Chrome(service=service_obj)
    driver.get("https://rahulshettyacademy.com/angularpractice/")
    driver.find_element(By.NAME, "email").send_keys("exampleInput")
    driver.find_element(By.ID, "exampleInputPassword1").send_keys("password")
    time.sleep(2)
    driver.close()

if __name__ == '__main__':
    main()
