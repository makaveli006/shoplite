// CloudFront Function (runtime cloudfront-js-2.0), attached to the DEFAULT behaviour only
// (the one that serves the React app from the S3 "frontend" bucket), event type: Viewer request.
//
// Why: the React app has its own page addresses (/products/chef-knife, /orders/15) that don't
// exist as files in S3. For those, S3 must send index.html, and React Router then shows the
// right page. Real files (/assets/index-abc123.js, /favicon.svg) are left alone.
//
// Why not CloudFront's "custom error responses" (403/404 -> index.html)? Those apply to the
// whole distribution, so a real 404 from the Django API (/api/products/missing/) would also
// turn into the React page. This function only runs for the frontend behaviour.
function handler(event) {
  var request = event.request;
  var lastPart = request.uri.split('/').pop();

  // No dot in the last part of the address = a page, not a file.
  if (lastPart.indexOf('.') === -1) {
    request.uri = '/index.html';
  }
  return request;
}
