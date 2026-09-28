"""Race-condition demo: two customers try to buy the LAST item at exactly the same moment.

Run it from the project root while the API is running:
    uv run --project backend python tools/race_demo.py

It uses only Python's standard library (no extra packages).
"""

import getpass
import json
import threading
import urllib.error
import urllib.request

API = 'http://127.0.0.1:8000/api'
PRODUCT = 'bamboo-cutting-board'
ADMIN_EMAIL = 'subin@ontash.net'
CUSTOMERS = {
    'Bob': ('bob@example.com', 'Sunny-Garden-42'),
    'Ana': ('ana.silva@example.com', 'Sunny-Garden-42'),
}
SHIPPING = {
    'full_name': 'Race Demo', 'address': '1 Test Street', 'city': 'Test City',
    'postal_code': '00000', 'country': 'Testland',
}


def call(method, path, body=None, token=None):
    """Send one request; return (status code, parsed JSON body)."""
    request = urllib.request.Request(f'{API}{path}', method=method)
    request.add_header('Content-Type', 'application/json')
    if token:
        request.add_header('Authorization', f'Bearer {token}')
    data = json.dumps(body).encode() if body is not None else None
    try:
        with urllib.request.urlopen(request, data=data) as response:
            return response.status, json.loads(response.read() or b'null')
    except urllib.error.HTTPError as error:
        return error.code, json.loads(error.read() or b'null')


def login(email, password):
    status, body = call('POST', '/auth/token/', {'email': email, 'password': password})
    if status != 200:
        raise SystemExit(f'Login failed for {email}: {status} {body}')
    return body['access']


def main():
    admin = login(ADMIN_EMAIL, getpass.getpass(f'Admin password for {ADMIN_EMAIL}: '))
    tokens = {name: login(email, password) for name, (email, password) in CUSTOMERS.items()}

    status, product = call('GET', f'/products/{PRODUCT}/')
    original_stock = product['stock']
    print(f'\n"{product["name"]}" has {original_stock} in stock. Setting it to 1 (the last one).')
    call('PATCH', f'/products/{PRODUCT}/', {'stock': 1}, admin)

    for name, token in tokens.items():
        call('DELETE', '/cart/', token=token)
        status, _ = call('POST', '/cart/items/', {'product_id': product['id'], 'quantity': 1}, token)
        print(f'{name} puts the last one in the cart -> {status}')

    # Both threads wait at the barrier, then press "Place order" at the same instant.
    barrier = threading.Barrier(len(tokens))
    results = {}

    def checkout(name, token):
        barrier.wait()
        results[name] = call('POST', '/orders/checkout/', SHIPPING, token)

    threads = [threading.Thread(target=checkout, args=item) for item in tokens.items()]
    print('\nBoth customers press "Place order" at the same moment...\n')
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()

    for name, (status, body) in results.items():
        if status == 201:
            print(f'{name}: {status} -> order #{body["id"]} created, total {body["total_amount"]}')
        else:
            print(f'{name}: {status} -> {body.get("problems", body)}')

    status, product = call('GET', f'/products/{PRODUCT}/', token=admin)
    print(f'\nStock now: {product["stock"]} (never negative, sold exactly once).')

    # Put the stock back as it was, minus the one that was really sold.
    call('PATCH', f'/products/{PRODUCT}/', {'stock': original_stock - 1}, admin)
    print(f'Stock restored to {original_stock - 1} ({original_stock} minus the one really sold).')


if __name__ == '__main__':
    main()
