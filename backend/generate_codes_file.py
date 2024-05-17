from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

shortWait = 10

def main():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/selenium")
    WebDriverWait(driver, shortWait).until(EC.element_to_be_clickable((By.ID, "email"))).send_keys("exampleInput")
    WebDriverWait(driver, shortWait).until(EC.invisibility_of_element_located((By.ID, "exampleInputPassword1"))).send_keys("password")
    WebDriverWait(driver, shortWait).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "Enter here"))).clear("Enter here")
    driver.find_element(By.NAME, "Enter here").send_keys("Enter here")
    driver.find_element(By.NAME, "Enter here").send_keys("Enter here")
    driver.find_element(By.NAME, "Enter here").send_keys("Enter here")
    driver.close()

if __name__ == '__main__':
    main()
