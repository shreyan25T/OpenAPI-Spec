from selenium import webdriver
from selenium.webdriver.common.by import By

from selenium import webdriver

def main():
    driver = webdriver.Chrome()
    driver.get("")
    driver.find_element(By.NAME, "email").send_keys("exampleInput")
    driver.find_element(By.ID, "exampleInputPassword1").send_keys("password")
    driver.close()

if __name__ == '__main__':
    main()
