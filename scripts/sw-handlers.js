self.addEventListener('fetch', function(event) {
	var requestURL = new URL(event.request.url);
	var isLocal = requestURL.origin == location.origin;
	var isGETRequest = requestURL.method == 'GET';

	if(isLocal && isGETRequest){
		event.respondWith(
			caches.open('pwaData').then(function(cache) {
				return fetch(event.request).then(function(response) {
					cache.put(event.request, response.clone());
					return response;
				});
			})
		);
	}
});
