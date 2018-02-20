const api = 'http://localhost:3000/api/v1';
const headers = {'AUTHORIZATION': `Bearer ${sessionStorage.jwtToken}`};

export default {
  get: (url, callback) => {
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
  },

  getAll: (url, callback) => {
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
        console.log('From server...');
        if(error) throw Error(error);
        networkData = true;
        callback(null, payload);
      }).catch(function(err) {
        callback(err);
      });
  },

  getById: (uri, callback) => {
    let url = api+uri;
    const request = new Request(url, {
      method: 'GET',
      headers: {'AUTHORIZATION': `Bearer ${sessionStorage.jwtToken}`}
    });
		fetch(request)
			.then(response => response.json())
			.then(({payload, error}) => {
        if(error){
          callback(error, null);
          return;
        }
        callback(null, payload);
      });
  },

  create: (url, body, callback) => {
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
        callback(error, null);
        return;
      }
      callback(null, id);
    });
  },

  update: (url, body, callback) => {
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
        callback(error, null);
        return;
      }
      callback(null, message);
    });
  },

  delete: (uri, callback) => {
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
  },

  uploadImage: (url, image, callback) => {
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
}
