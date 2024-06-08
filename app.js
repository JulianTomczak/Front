window.onload = function() {
    fetchCurrent(); // Muestra la temperatura y humedad actuales por defecto
  }
  
  function fetchCurrent() {
    fetch('http://localhost:3000/current')
      .then(response => response.json())
      .then(data => {
        document.getElementById('data-container').innerHTML = `
          <h2>Temperatura y Humedad Actuales</h2>
          <p>Temperatura: ${data.temperatura}°C</p>
          <p>Humedad: ${data.humedad}%</p>
        `;
      })
      .catch(error => console.error('Error:', error));
  }
  
  function fetchHistory() {
    fetch('http://localhost:3000/history')
      .then(response => response.json())
      .then(data => {
        const historialTemperaturas = data.historialTemperaturas;
  
        const labels = historialTemperaturas.map(entry => entry.timestamp);
        const temperaturaData = historialTemperaturas.map(entry => entry.temperatura);
        const humedadData = historialTemperaturas.map(entry => entry.humedad);
  
        const ctx = document.getElementById('data-container').getContext('2d');
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Temperatura (°C)',
              data: temperaturaData,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 1
            }, {
              label: 'Humedad (%)',
              data: humedadData,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'hour'
                }
              },
              y: {
                beginAtZero: true
              }
            }
          }
        });
      })
      .catch(error => console.error('Error:', error));
  }
  
  function customizeValues() {
    document.getElementById('data-container').innerHTML = `
      <h2>Personalizar Valores</h2>
      <form id="customize-form">
        <label for="temperaturaMin">Temperatura Mínima (°C):</label>
        <input type="number" id="temperaturaMin" name="temperaturaMin" required><br><br>
        <label for="temperaturaMax">Temperatura Máxima (°C):</label>
        <input type="number" id="temperaturaMax" name="temperaturaMax" required><br><br>
        <label for="humedadMin">Humedad Mínima (%):</label>
        <input type="number" id="humedadMin" name="humedadMin" required><br><br>
        <label for="humedadMax">Humedad Máxima (%):</label>
        <input type="number" id="humedadMax" name="humedadMax" required><br><br>
        <button type="submit">Guardar</button>
      </form>
    `;
  
    document.getElementById('customize-form').addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(this);
      const data = {
        temperaturaMin: formData.get('temperaturaMin'),
        temperaturaMax: formData.get('temperaturaMax'),
        humedadMin: formData.get('humedadMin'),
        humedadMax: formData.get('humedadMax')
      };
      customizeValuesRequest(data);
    });
  }
  
  function customizeValuesRequest(data) {
    fetch('http://localhost:3000/customize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        alert('Valores personalizados guardados exitosamente.');
      } else {
        alert('Error al guardar los valores personalizados. Inténtalo de nuevo.');
      }
    })
    .catch(error => console.error('Error:', error));
  }
  