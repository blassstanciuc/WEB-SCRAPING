from selenium import webdriver
import time
import openpyxl

# Inicializar el controlador del navegador
driver = webdriver.Chrome()

# Navegar a la página de productos
driver.get("https://shop.yaguar.com.ar/frontendSP/asp/home.asp#")

# Esperar a que la página se cargue completamente
time.sleep(5)

# Encontrar la tabla de productos y obtener sus datos
table = driver.find_element_by_xpath("//table[@class='table table-striped table-hover table-condensed table-responsive']")
rows = table.find_elements_by_xpath(".//tr")
data = []
for row in rows:
    cols = row.find_elements_by_xpath(".//td")
    cols = [col.text.strip() for col in cols]
    data.append(cols)

# Exportar los datos a un archivo Excel
wb = openpyxl.Workbook()
ws = wb.active
for row in data:
    ws.append(row)
wb.save("productos.xlsx")

# Avanzar a la siguiente página
driver.find_element_by_link_text("Siguiente").click()

# Cerrar el navegador
driver.quit()
