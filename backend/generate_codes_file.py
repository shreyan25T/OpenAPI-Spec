from selenium import webdriver
from selenium.webdriver.common.by import By

def main():
    driver = webdriver.Chrome()
    driver.find_element(By.NAME, "email").send_keys("exampleInput")
    driver.find_element(By.ID, "exampleInputPassword1").send_keys("password")
    driver.close()

if __name__ == '__main__':
    main()
