import random
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from selenium.webdriver.common.action_chains import ActionChains

QUERIES = [
    "An aged, hand-drawn map of a fantasy realm, featuring mountain ranges, enchanted forests, winding rivers, ancient ruins, and mythical cities, with ornate borders and a compass rose.",
    "A dramatic battlefield where armored warriors, mythical creatures, and spellcasters clash in chaos, under a stormy sky lit by fire, magic, and steel.",
    "A vast, otherworldly city or castle built into cliffs or floating islands, with towering spires, glowing lights, and a sense of ancient magic in the architecture.",
    "A lone hero stands at the edge of a cliff or ancient ruin, weapon in hand, surrounded by a mysterious landscape that hints at destiny and danger.",
    "A powerful mythical creature—like a dragon, griffin, or phoenix—posed in a majestic or menacing stance, dominating its environment with an aura of magic.",
    "A magical or ominous landscape such as a glowing forest, icy wasteland, or haunted canyon, filled with unusual lights, shadows, and hidden mysteries.",
    "An ancient, magical artifact resting on a pedestal or hidden in a secret chamber, radiating energy and surrounded by mysterious symbols and weathered ruins."
]


def wait_for_download(download_dir,timeout=60):
        print("waiting to continue image downloads ...")
        end_time = time.time() + timeout
        while any(f.endswith('.crdownload') for f in os.listdir(download_dir)):
            if end_time > timeout:
                print("Timeout reached while waiting for downloads")
                break
            time.sleep(1)
            print("Done")


# Chrome Setup


def process_query(BASE_DOWNLOAD_DIR, driver, query, nbr_image=6):

    os.makedirs(BASE_DOWNLOAD_DIR, exist_ok=True)

    driver.get(f"https://lexica.art/?q={query.replace(' ','+')}")

    try:
        # Wait for page to fully load
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.XPATH, '//div[@role="grid"]'))
        )
        
        # Get window size once
        window_size = driver.get_window_size()
        height = window_size["height"]
        time.sleep(3)
        

        for index in range(nbr_image):  # Process first 5 items
            try:
                # Re-fetch parent and children each iteration to avoid staleness
                parent_div = driver.find_element(By.XPATH, '//div[@role="grid"]')
                child_divs = parent_div.find_elements(By.XPATH, "./div")
                
                # Safety check
                if index >= len(child_divs):
                    print(f"Only {len(child_divs)} items available")
                    break
                    
                child = child_divs[index]
                
                # Scroll to element (center of viewport)
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", child)
                time.sleep(0.8)  # Allow scrolling to complete
                
                # Click the specific child (not generic div)
                WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable(child)
                ).click()
                time.sleep(1)
                
                # Download
                download_btn = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, '//a[@title="Download"]'))
                )
                download_btn.click()
                time.sleep(random.uniform(2, 3))   # Allow download to initiate
                
                # Close modal by clicking top-left
                actions = ActionChains(driver)
                actions.move_by_offset(10, height//4).click().perform()
                actions.reset_actions()  # Clear previous actions
                time.sleep(1)
                
                
                
            except Exception as e:
                print(f"Error with element {index}: {str(e)}")
                # Try refreshing if stuck
                driver.refresh()
                time.sleep(2)
                continue
        

    finally:
        wait_for_download(BASE_DOWNLOAD_DIR)
        driver.refresh()

def main():
    chrome_options = webdriver.ChromeOptions()
    BASE_DOWNLOAD_DIR = os.path.abspath("./lexica_downloads")

    prefs = {
        "download.default_directory": BASE_DOWNLOAD_DIR,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing.enabled": True,
        "profile.default_content_setting_values.automatic_downloads": 1
    }
    chrome_options.add_experimental_option("prefs", prefs)
    driver = webdriver.Chrome(options=chrome_options) 

    try:
        for query in QUERIES:
            process_query(BASE_DOWNLOAD_DIR, driver, query, nbr_image=6)
            time.sleep(random.uniform(2,5))

    finally:
        driver.quit()
        print("\nAll queries processed. Download summary:")
        for query in QUERIES:
            if os.path.exists(BASE_DOWNLOAD_DIR):
                print(f"{query}: {len(os.listdir(BASE_DOWNLOAD_DIR))} images")


if __name__ == "__main__":
    main()