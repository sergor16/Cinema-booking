$(document).ready(function() {
    // Массив для хранения всех бронирований
    let reservations = [];

    // Загружаем данные из localStorage, если они есть
    if (localStorage.getItem('reservations')) {
        reservations = JSON.parse(localStorage.getItem('reservations'));
    }

    // Функция для генерации списка доступных дат
    function generateDatePicker() {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7); // Начинаем неделю назад
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7); // Заканчиваем через неделю вперед

        $('#date-picker').empty(); // Очищаем блок перед созданием нового контента

        while (startDate <= endDate) {
            const dateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
            const option = $('<option>', { value: dateStr });
            option.text(dateStr);
            $('#date-picker').append(option);

            startDate.setDate(startDate.getDate() + 1);
        }

        // Добавляем обработчик события смены даты
        $('#date-picker').on('input', function () {
            const selectedDate = $(this).val();
            generateSessionsList(selectedDate);
        });
    }

    // Функция для генерации списка сеансов
    function generateSessionsList(date) {
        const sessions = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
        $('#sessions-list').empty(); // Очищаем блок перед созданием нового контента

        sessions.forEach(session => {
            const sessionOption = $('<option>', { value: session });
            sessionOption.text(session);
            $('#sessions-list').append(sessionOption);
        });

        // Добавляем обработчик события смены сеанса
        $('#sessions-list').on('input', function () {
            const selectedSession = $(this).val();
            generateSeatsGrid(date, selectedSession);
        });
    }

    // Функция для генерации сетки мест
    function generateSeatsGrid(date, session) {
        $('#seats-container').empty(); // Очищаем блок перед созданием нового контента

        for (let i = 1; i <= 50; i++) {
            const seat = $('<div>', { class: 'seat' });
            seat.attr('data-seat-id', i);
            $('#seats-container').append(seat);
        }

        // Отмечаем уже забронированные места
        reservations.forEach(reservation => {
            if (reservation.date === date && reservation.session === session) {
                const bookedSeat = $(`#seats-container .seat[data-seat-id="${reservation.seatId}"]`);
                bookedSeat.addClass('booked');
            }
        });

        // Добавляем обработчики кликов по местам
        $('.seat').off().click(function() {
            const seat = $(this);
            if (!seat.hasClass('booked')) {
                if (seat.hasClass('selected')) {
                    seat.removeClass('selected');
                } else {
                    seat.addClass('selected');
                }
            }
        });
    }

    // Функция для обработки бронирования
    $('#book-button').click(function() {
        const selectedDate = $('#date-picker').val();
        const selectedSession = $('#sessions-list').val();
        const selectedSeats = $('.seat.selected');

        if (selectedDate && selectedSession && selectedSeats.length > 0) {
            selectedSeats.each(function() {
                const seatId = $(this).attr('data-seat-id');
                reservations.push({ date: selectedDate, session: selectedSession, seatId: seatId });
            });

            // Сохраняем данные в localStorage
            localStorage.setItem('reservations', JSON.stringify(reservations));

            alert('Билеты успешно забронированы!');
            location.reload(); // Обновляем страницу после успешного бронирования
        } else {
            alert('Пожалуйста, выберите дату, сеанс и хотя бы одно место.');
        }
    });

    // Инициализация
    generateDatePicker();
});