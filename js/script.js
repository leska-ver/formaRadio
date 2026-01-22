// Обработка формы заказа
document.addEventListener('DOMContentLoaded', function() {
  const orderForm = document.getElementById('orderForm');
  
  if (orderForm) {
    orderForm.addEventListener('submit', async function(event) {
      event.preventDefault(); // Отменяем стандартную отправку
      
      // ВАЖНО: Получаем красивое название цвета из data-атрибута
      const selectedColorRadio = document.querySelector('input[name="color"]:checked');
      const colorValueForServer = selectedColorRadio ? selectedColorRadio.value : null;
      const colorDisplayName = selectedColorRadio ? selectedColorRadio.dataset.displayName : null;

      // Собираем данные формы
      const formData = new FormData(orderForm);
      const data = {
        size: formData.get('size'),
        color: colorValueForServer, // Английское значение для сервера
        color_display: colorDisplayName, // Русское название для отображения
        email: formData.get('email'),
        product: document.querySelector('.product-title')?.textContent || 'Лифчик',
        timestamp: new Date().toLocaleString('ru-RU')
      };
      
      // Проверяем, выбраны ли размер и цвет
      let errorMessage = '';
      
      if (!data.size && !data.color) {
        showMessage('🚫 Вы не выбрали размер И цвет', 'error');
        return;
      }

      if (!data.size) {
        showMessage('📏 Вы не выбрали размер', 'error');
        return;
      }

      if (!data.color) {
        showMessage('🎨 Вы не выбрали цвет', 'error');
        return;
      }
      
      // Если есть ошибка - показываем и останавливаем
      if (errorMessage) {
        showMessage(errorMessage, 'error');
        return;
      }
      
      // Показываем состояние "отправка"
      const submitBtn = orderForm.querySelector('.productCard__btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Отправка...';
      submitBtn.disabled = true;
      
      try {
        // Имитация отправки на сервер (замените на реальный запрос)
        await simulateServerRequest(data);
       
        // ПОСЛЕ успешной отправки показываем "ЗАКАЗ ПРИНЯТ". ИСПОЛЬЗУЕМ colorDisplayName для красивого отображения
        showMessage(`
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
            <strong style="font-size: 18px; color: #2e7d32;">ВАШ ЗАКАЗ ПРИНЯТ!</strong><br>
            <span style="color: #555;">Спасибо за покупку! 🎉</span>
          </div>
        `, 'success');
        
        // Дополнительная информация через секунду
        setTimeout(() => {
          const messageDiv = document.getElementById('formMessage');
          if (messageDiv.innerHTML.includes('ВАШ ЗАКАЗ ПРИНЯТ')) {
            messageDiv.innerHTML += `<br><small style="color: #666;">Заказ: ${data.size}, ${colorDisplayName}.</small>`;
          }
        }, 1000);
        
        // Сбрасываем форму
        orderForm.reset();
        
      } catch (error) {
        console.error('Ошибка отправки формы:', error);
        showMessage('❌ Ошибка отправки. Попробуйте еще раз.', 'error');
      } finally {
        // Возвращаем кнопку в исходное состояние
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Функция показа сообщений
  function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = text; // Изменил на innerHTML для поддержки эмодзи
    messageDiv.className = `productCard__message ${type}`;
    messageDiv.style.display = 'block';
    
    // Автоматически скрываем сообщение через 10 секунд
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 10000);
  }
  
  // Функция имитации запроса к серверу
  function simulateServerRequest(data) {
    return new Promise((resolve) => {
      console.log('Отправка данных на сервер:', data);
      
      // Имитация задержки сети
      setTimeout(() => {
        resolve({ success: true, message: 'Данные получены сервером' });
      }, 800);
    });
  }
});