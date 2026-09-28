from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """?page=2 selects the page, ?page_size=24 changes its size (up to 100).

    Response shape: {"count": 21, "next": "...?page=2", "previous": null, "results": [...]}
    """

    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100
