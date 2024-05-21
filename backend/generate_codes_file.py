from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

shortWait = 10

def main():
    driver = webdriver.Chrome()
    driver.get("")
    driver.find_element(By.NAME, "email").send_keys("exampleInput")
    driver.find_element(By.ID, "exampleInputPassword1").send_keys("password")
    driver.find_element(By.NAME, "").send_keys()
    driver.close()

if __name__ == '__main__':
    main()
