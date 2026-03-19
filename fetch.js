const id = '90e58b7c-1572-41d1-ae9b-43e90cbf12a7';
fetch('http://192.168.1.165:3000/api/post/' + id)
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
