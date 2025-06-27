import requests
from bs4 import BeautifulSoup

url = "https://menu.sanborns.com.mx/pedir"
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

menu = {}
sections = soup.find_all("section")

for section in sections:
    section_title = section.find("h3", class_="categoryTitle").text if section.find("h3", class_="categoryTitle") else "Sin nombre"
    menu[section_title] = {}
    cards = section.find_all("div", class_="card")
    for card in cards:
        sku = card.find("span", class_="orderProductName").text.split()[-1]
        name = card.find("span", class_="orderProductName").text
        description = card.find("p", class_="line-clamp-3").text
        price_div = card.find("div", class_="flex gap-x-2 text-sm flex-row")
        price = float(price_div.find("div").text.replace("$", ""))
        at_discount = float(price_div.find("div", class_="text-muted-foreground").text.replace("$", "")) if price_div.find("div", class_="text-muted-foreground") else price
        discount = float(card.find("span", class_="text-sm font-bold").text.replace("%", "")) if card.find("span", class_="text-sm font-bold") else 0
        image = card.find("img")["src"]
        menu[section_title][sku] = {
            "name": name,
            "description": description,
            "price": price,
            "atDiscount": at_discount,
            "discount": discount,
            "image": image
        }

print(menu)