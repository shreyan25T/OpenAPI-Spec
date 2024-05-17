from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

shortWait = 10

def main():
    driver = webdriver.Chrome()
    driver.get("https://rahulshettyacademy.com/angularpractice/")
    WebDriverWait(driver, shortWait).until(EC.element_to_be_clickable((By.NAME, "email"))).send_keys("exampleInput")
    WebDriverWait(driver, shortWait).until(EC.presence_of_element_located((By.CSS_SELECTOR, "exampleInputPassword1"))).send_keys("password")
    driver.find_element(By.NAME, "Enter here").send_keys("Enter here")
    driver.close()

if __name__ == '__main__':
    main()
