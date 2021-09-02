# Nexapp
Demo Backend Applcation for Nexbuy District Limited

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!--[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="">
    <img src="https://user-images.githubusercontent.com/65955286/131874221-e9d82181-5e2d-4a8c-ac19-1e789fc5d5b0.jpg" alt="Logo" width="380" height="380">
  </a>
 
 <h2>Demo Backend for Nexapp Application</h2>
 
  
  <p align="center">
    Offering trust in mediation and providing the right number of prospects!
    <br />
    <a href="https://github.com/nwokoyepraise/nexapp"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/nwokoyepraise/nexapp">View Demo</a>
    ·
    <a href="https://github.com/nwokoyepraise/nexapp/issues">Report Bug</a>
    ·
    <a href="https://github.com/nwokoyepraise/nexapp/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#api-endpoints">API Endpoints</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
This is a demo backend for Nexbuy's Disttrict shopping platform. It consists of endoints for some important services such as the ability to get list of available products, get product details, add and remove item to user cart, chekout cart as well as verify transaction charge. 

Nexbuy District Limited is linked at <a href="https://www.nexbuydistrict.com/">here</a>

<!-- END POINTS -->
## Services Available on the Demo Backend
- Product List
- Product Details
- Cart - Add Item
- Cart - Remove Item
- Cart - Details
- Checkout - Item
- Checkout - Verify Charge


### Built With

The project was built natively with the following technologies
* [Node.js](https://nodejs.org)
* [ExpressJs](https://expressjs.com)
* [Flutterwave](https://github.com/Flutterwave/ravepay-nodejs)



<!-- GETTING STARTED -->
## Getting Started

To build the project locally, simply clone the github repository. Navigate to root project folder and run the following to install packages:

`npm install`

After packages have been installed. Proceed to run:

`node app.js`

## API Endpoints

### Product List Endpoint

This endpoint is used to get a list of products under a specific tab e.g. "For You" tab

```http

GET /api/products/list?tab=FOR%20YOU HTTP/1.1
Host: nexapp-backend.herokuapp.com

Response:
{
  "status": true,
    "data": [
        {
            "product_id": "string",
            "seller_id": "string",
            "timestamp": "number",
            "product_name": "string",
            "unit_price": "number",
            "currency": "string",
            "photo": [
                "string"
            ],
            "seller_name": "string",
            "verified": "boolean"
        }
           ]
}
```
#### Request Params
| Field Name                     | Description                 |
|-----------------------------------|--------------------------------|
| tab              | Product tab to list from. Can either be "FOR YOU", "TRENDING", "CATEGORIES", "EARLY ACCESS" OR "SPECIALS"   |
| lt (not required)               | This refers to the last timestamp of the last object returned in the previous query. Used for pagination.|
| forward (not required)           | This is used for pagination and can either be true or false for forward and backward pagination respectively |

### Product Details Endpoint

This endpoint is used to get the details of a particular product

```http

GET /api/products/product_details?product_id=product_0001 HTTP/1.1
Host: localhost:3000

Response:
{
  "status": true,
    "data":
        {
            "product_id": "string",
            "seller_id": "string",
            "product_name": "string",
            "unit_price": "number",
            "currency": "string",
            "photo": [
                "string"
            ],
            "seller_name": "string",
            "verified": "boolean",
             "product_desc": "string",
        "delivery_methods": [],
        "avail_colors": [],
        "avail_sizes": [],
        "avail_quantity": "number",
        "pckg_fee": "number",
        "delivery_fee": "number"
        }
}
```
#### Request Params
| Field Name                     | Description                 |
|-----------------------------------|--------------------------------|
| product_id              | Product ID of product whose details are required|


### Cart - Add Item

Endpoint used to add product to cart

```http

POST /api/user/cart/add_item HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"user_id": "string", "product_id": "product_0001", "quantity": "number", "delivery_method": "string", "product_color": "string", "product_size":"number", "delivery_addr": "string"}

Response:
{
  "status": true,
    "data":
        {
            "item_id": "string",
            "product_id": "string",
            "user_id": "string",
            "quanitity": "number",
            "delivery_method": "string",
            "product_color": "string",
            "product_size": "string",
            "delivery_addr": "string"
        }
}
```

### Cart - Remove Item

Endpoint used to add product to cart

```http

POST /api/user/cart/remove_item HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"user_id":"string", "item_id": "string"}

Response:
{
    "status": true,
    "data": {
        "message": "string"
    }
}
```

### Cart Details Endpoint

This endpoint is used to get user cart details

```http

GET /api/user/cart?user_id=string HTTP/1.1
Host: localhost:3000

Response:
{
  "status": true,
    "data": 
        {
            "item_id": "string",
            "product_id": "string",
            "user_id": "string",
            "quantity": "number",
            "delivery_method": "string",
            "product_color": "string",
            "product_size": "string",
            "unit_price": "number",
            "delivery_addr": "string",
            "product_name": "string",
            "product_desc": "string",
            "photo": [
                "string"
            ],
            "delivery_fee": "number",
            "pckg_fee": "number",
            "currency": "string",
            "seller_id": "string",
            "seller_name": "string",
            "verified": "boolean",
             "total": "number"
        }
}
```
#### Request Params
| Field Name                     | Description                 |
|-----------------------------------|--------------------------------|
| user_id              | Customer User ID|

### Checkout - Item

This endpoint is used to checkout item from cart

```http

POST /api/cart/checkout/item HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"user_id":"string","item_id":"string","card_number": "string", "cvv": "string", "expiry_month": "string", "expiry_year": "string", "fullname": "string", "email":"string", "phone_number": "string"
}

Response:
{
    "status": true,
    "data": {
        "id": "number",
        "tx_ref": "string",
        "flw_ref": "string",
        "device_fingerprint": "string",
        "amount": "number",
        "charged_amount": "number",
        "app_fee": "number",
        "merchant_fee": "number",
        "processor_response": "string",
        "auth_model": "string",
        "currency": "string",
        "ip": "string",
        "narration": "string",
        "status": "string",
        "auth_url": "string",
        "payment_type": "string",
        "plan": "string",
        "fraud_status": "string",
        "charge_type": "string",
        "created_at": "string",
        "account_id": "number"
    }
}
```

### Verify Charge Endpoint

This endpoint is used verify if a transaction (charge) was successfully

```http

POST /api/cart/checkout/verify_charge HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"user_id":"string", "tx_id": "string"}

Response:
{
  "status": true,
    "data":
        {
            "message": "string"          
        }
}
```


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/nwokoyepraise/foodslify/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the GNU-V3 License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/nwokoyepraise/nexapp](https://github.com/nwokoyepraise/nexapp)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [othneildrew](https://github.com/othneildrew)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/nwokoyepraise/foodslify/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/praise-chibuike-7bb76718a
