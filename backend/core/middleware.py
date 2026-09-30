from django.http import HttpResponse

HEALTH_PATH = '/healthz/'


class HealthCheckMiddleware:
    """Answers GET /healthz/ with "ok", before any other middleware runs.

    The load balancer checks every few seconds whether each web container is alive. Those
    checks arrive with the container's private IP address as the host name, which Django's
    ALLOWED_HOSTS check would refuse (400), and over plain HTTP, which the HTTPS redirect
    would answer with 301. Answering here, first, avoids both while ALLOWED_HOSTS stays strict.

    It deliberately doesn't touch the database: if the database had a hiccup, every container
    would look "dead" at once and be replaced, which wouldn't fix anything.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == HEALTH_PATH:
            return HttpResponse('ok', content_type='text/plain')
        return self.get_response(request)
