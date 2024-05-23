from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

shortWait = 10

def main():
    driver = webdriver.Chrome()
    driver.get("https://rahulshettyacademy.com/angularpractice/")
    time.sleep(2)
    WebDriverWait(driver, shortWait).until(EC.element_to_be_clickable((By.NAME, "email"))).send_keys("simranmaurya")
    driver.find_element(By.ID, "exampleInputPassword1").send_keys("password")
    time.sleep(2)
    driver.find_element(By.NAME, "").send_keys()
    time.sleep(2)
    driver.close()

if __name__ == '__main__':
    main()
