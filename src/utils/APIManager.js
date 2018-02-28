const api = '/api/v1';
const headers = {'AUTHORIZATION': `Bearer ${sessionStorage.jwtToken}`};

export function getRequest(url, callback){
  var networkData = false;
  if ('caches' in window) {
    caches.match(api+url).then(function(response) {
      if (response) {
        response.json().then(function({payload}) {
          if(!networkData) {
            callback(null, payload)
          }
        });
      }
    });
  }
  const request = new Request(api+url, {
    method: 'GET',
    headers: {'AUTHORIZATION': `Bearer ${sessionStorage.jwtToken}`}
  });
  fetch(request)
    .then(response => response.json())
    .then(function({payload, error}) {
      if(error) throw Error(error);
      networkData = true;
      callback(null, payload);
    }).catch(function(err) {
      callback(err);
    });
}

export function createRequest(url, body, callback){
  body = JSON.stringify(body)
  fetch(api+url, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'AUTHORIZATION': `Bearer ${sessionStorage.jwtToken}`
    },
    body: body
  })
	.then(response => response.json())
  .then(({error, id}) => {
    if(error){
      callback(error);
      return;
    }
    callback(null, id);
  });
}

export function updateRequest(url, body, callback){
  body = JSON.stringify(body)
  fetch(api+url, {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'AUTHORIZATION': `Bearer ${sessionStorage.jwtToken}`
    },
    body: body
  })
	.then(response => response.json())
  .then(({error, message}) => {
    if(error){
      callback(error);
      return;
    }
    callback(null, message);
  });
}

export function deleteRequest(uri, callback){
  const request = new Request(api+uri, {
    method: 'delete',
    headers: {'AUTHORIZATION': `Bearer ${sessionStorage.jwtToken}`}
  });
  fetch(request)
  .then(response => response.json())
  .then(({error}) => {
      if(error){
        callback(error);
        return;
      }
      callback();
  });
}

export function uploadImage(url, image, callback){
  const data = new FormData();
  data.append('image', image);
  fetch(api+url, {
    method: "POST",
    headers: {
      'AUTHORIZATION': `Bearer ${sessionStorage.jwtToken}`
    },
    body: data
  }).then(response => response.json())
  .then(({error}) => {
    if(error){
      callback(error);
      return;
    }
    callback();
  });
}
