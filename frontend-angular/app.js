document.getElementById('loginBtn')
.addEventListener('click', async () => {

  await fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  window.location.href = '/dashboard.html';
});

document.getElementById('checkoutBtn')
.addEventListener('click', async () => {

  const response = await fetch(
    'http://localhost:8080/api/orders'
  );

  const data = await response.text();

  document.getElementById('result')
    .innerText = data;
});
